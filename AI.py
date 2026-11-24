import cv2, time, queue, threading, pyttsx3
import numpy as np
import mediapipe as mp
import speech_recognition as sr
from PIL import Image, ImageDraw, ImageFont

mp_pose, mp_face, mp_draw = mp.solutions.pose, mp.solutions.face_mesh, mp.solutions.drawing_utils
pose = mp_pose.Pose(model_complexity=1, smooth_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5)
face_mesh = mp_face.FaceMesh(max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5, min_tracking_confidence=0.5)

FONT_PATHS = [
    "C:/Windows/Fonts/times.ttf",
    "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
    "/usr/share/fonts/truetype/msttcorefonts/Times_New_Roman.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
]
BOX_HEIGHT_RATIO, WHITE, _font_cache = 0.22, (255, 255, 255), {}

def load_font(size):
    size = max(12, int(size))
    if size not in _font_cache:
        for p in FONT_PATHS:
            try:
                _font_cache[size] = ImageFont.truetype(p, size=size)
                break
            except OSError:
                continue
        else:
            _font_cache[size] = ImageFont.load_default()
    return _font_cache[size]

BAD_POSTURE_SEC, POSTURE_LIMIT = 1.5, 30
EAR_THRESH, EYE_CLOSED_SEC, MIN_BLINK_SEC = 0.21, 2.0, 0.08
BREAK_SEC, BREAK_COOLDOWN, VOICE_COOLDOWN = 1800, 60, 5
LEFT_EYE, RIGHT_EYE = [33, 160, 158, 133, 153, 144], [362, 385, 387, 263, 373, 380]

status_lock, current_status = threading.Lock(), "Starting..."
voice_on, cmds_on, shutdown = threading.Event(), threading.Event(), threading.Event()
voice_on.set(); cmds_on.set()
speech_q = queue.Queue(maxsize=10)

def calc_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ang = abs((np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])) * 180.0 / np.pi)
    return 360 - ang if ang > 180 else ang

def calc_ear(pts):
    horiz = np.linalg.norm(pts[0] - pts[3])
    return 0 if horiz == 0 else (np.linalg.norm(pts[1] - pts[5]) + np.linalg.norm(pts[2] - pts[4])) / (2.0 * horiz)

def fmt_dur(sec):
    m, s = divmod(int(sec), 60); h, m = divmod(m, 60)
    return f"{h}h {m}m {s}s" if h else f"{m}m {s}s"

def speak(msg, force=False):
    if force or voice_on.is_set():
        try: speech_q.put_nowait((msg, force))
        except queue.Full: pass

def voice_worker():
    engine = None
    while not shutdown.is_set():
        try: item = speech_q.get(timeout=0.5)
        except queue.Empty: continue
        if item is None: break
        msg, force = item
        if force or voice_on.is_set():
            try:
                if engine is None:
                    engine = pyttsx3.init()
                    engine.setProperty("rate", 165); engine.setProperty("volume", 1.0)
                engine.say(msg); engine.runAndWait()
            except Exception as e:
                print("Voice error:", e); engine = None
        speech_q.task_done()
    if engine:
        try: engine.stop()
        except Exception: pass

def cmd_worker():
    rec = sr.Recognizer()
    try:
        mic = sr.Microphone()
        with mic as src:
            print("Adjusting microphone for ambient noise...")
            rec.adjust_for_ambient_noise(src, duration=1)
            print("Voice commands are ready. Press 'M' to mute/unmute commands.")
        while not shutdown.is_set():
            if not cmds_on.is_set():
                time.sleep(0.2); continue
            try:
                with mic as src:
                    audio = rec.listen(src, timeout=1, phrase_time_limit=3)
                if not cmds_on.is_set(): continue
                cmd = rec.recognize_google(audio).lower()
                print("You said:", cmd)
                if "status" in cmd:
                    with status_lock: speak(current_status)
                elif "mute voice" in cmd or "mute alerts" in cmd:
                    voice_on.clear(); print("Voice alerts muted.")
                elif "enable voice" in cmd or "enable alerts" in cmd:
                    voice_on.set(); speak("Voice alerts enabled.", force=True)
                elif "quit" in cmd or "exit" in cmd:
                    speak("Closing posture correction system."); time.sleep(1); shutdown.set()
            except (sr.WaitTimeoutError, sr.UnknownValueError): continue
            except sr.RequestError:
                print("Speech recognition service error (check internet connection)."); time.sleep(2)
    except Exception as e:
        print("Microphone error:", e, "\nCheck your microphone and PyAudio installation.")

threading.Thread(target=voice_worker, daemon=True).start()
threading.Thread(target=cmd_worker, daemon=True).start()

WIN = "SIT STRAIGHT And Keep Working"
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Cannot access webcam."); shutdown.set(); pose.close(); face_mesh.close()
    raise SystemExit

cv2.namedWindow(WIN, cv2.WINDOW_NORMAL)
cv2.setWindowProperty(WIN, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)
is_fs = True
bad_start = eye_start = sit_start = None
prev_closed, blinks = False, 0
last_posture_v = last_eye_v = last_break_v = 0
speak("Posture correction system started.")

try:
    while not shutdown.is_set():
        ok, frame = cap.read()
        if not ok:
            print("Unable to read webcam frame."); break
        h, w, _ = frame.shape
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        p_res, f_res, now = pose.process(rgb), face_mesh.process(rgb), time.monotonic()
        present = bool(p_res.pose_landmarks or f_res.multi_face_landmarks)

        # Break timer
        break_due, sit_dur = False, 0.0
        if present:
            sit_start = sit_start or now
            sit_dur = now - sit_start
            if sit_dur >= BREAK_SEC:
                break_due = True
                if now - last_break_v > BREAK_COOLDOWN:
                    speak("Time for a break! Stand up, stretch, and rest your eyes."); last_break_v = now
        else:
            sit_start = None

        # Posture detection
        p_status, angle, p_alert = "Body not detected", None, False
        if p_res.pose_landmarks:
            lm = p_res.pose_landmarks.landmark
            mp_draw.draw_landmarks(frame, p_res.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            pairs = [(lm[mp_pose.PoseLandmark.LEFT_SHOULDER], lm[mp_pose.PoseLandmark.LEFT_EAR]),
                     (lm[mp_pose.PoseLandmark.RIGHT_SHOULDER], lm[mp_pose.PoseLandmark.RIGHT_EAR])]
            active = next(((s, e) for s, e in pairs if s.visibility > 0.5 and e.visibility > 0.5), None)
            if active:
                sh = (int(active[0].x * w), int(active[0].y * h))
                er = (int(active[1].x * w), int(active[1].y * h))
                angle = calc_angle(er, sh, (sh[0], sh[1] - 100))
                if angle < POSTURE_LIMIT:
                    p_status, bad_start = "Good Posture", None
                else:
                    p_status = "Bad Posture"
                    bad_start = bad_start or now
                    p_alert = (now - bad_start) >= BAD_POSTURE_SEC
            else:
                bad_start = None
        else:
            bad_start = None
        if p_alert and now - last_posture_v > VOICE_COOLDOWN:
            speak("Warning! Bad posture. Please sit straight."); last_posture_v = now

        # Eye closure & blink detection
        e_status, ear, d_alert = "Face not detected", 0.0, False
        if f_res.multi_face_landmarks:
            flm = f_res.multi_face_landmarks[0].landmark
            le = [np.array([int(flm[i].x * w), int(flm[i].y * h)]) for i in LEFT_EYE]
            re = [np.array([int(flm[i].x * w), int(flm[i].y * h)]) for i in RIGHT_EYE]
            ear = (calc_ear(le) + calc_ear(re)) / 2.0
            for pt in le + re: cv2.circle(frame, tuple(pt), 2, (255, 255, 0), -1)
            closed = ear < EAR_THRESH
            if closed:
                e_status, eye_start = "Eyes Closed", eye_start or now
                if now - eye_start >= EYE_CLOSED_SEC:
                    e_status, d_alert = "DROWSINESS WARNING", True
                    if now - last_eye_v > VOICE_COOLDOWN:
                        speak("Your eyes have been closed for too long. Please stay alert."); last_eye_v = now
            else:
                e_status = "Eyes Open"
                if prev_closed and eye_start and MIN_BLINK_SEC <= now - eye_start < EYE_CLOSED_SEC:
                    blinks += 1
                eye_start = None
            prev_closed = closed
        else:
            eye_start, prev_closed = None, False

        # Bottom box display
        with status_lock:
            current_status = f"{p_status}. {e_status}.{' Take a break!' if break_due else ''}"
        pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).convert("RGBA")
        ov = Image.new("RGBA", pil.size, (0, 0, 0, 0))
        dr = ImageDraw.Draw(ov)
        bh, px = int(h * BOX_HEIGHT_RATIO), int(w * 0.025)
        bt, py = h - bh, int(bh * 0.12)
        dr.rectangle([(0, bt), (w, h)], fill=(0, 0, 0, 185))
        dr.line([(0, bt), (w, bt)], fill=(255, 255, 255, 220), width=2)
        f_body, f_alert = load_font(bh * 0.16), load_font(bh * 0.17)

        cols = [
            [f"Posture: {p_status}", f"Neck Angle: {int(angle)}°" if angle is not None else "Neck Angle: --",
             f"Sitting Time: {fmt_dur(sit_dur)}" if present else "Sitting Time: Away"],
            [f"Eyes: {e_status}", f"EAR: {ear:.2f}", f"Blink Count: {blinks}"],
            [f"Voice: {'ON' if voice_on.is_set() else 'MUTED'}",
             f"Cmds: {'ON' if cmds_on.is_set() else 'MUTED'}",
            ],
        ]
        cw, rs = (w - 2 * px) // 3, int((bh - 2 * py) / 4)
        for ci, lines in enumerate(cols):
            for ri, txt in enumerate(lines):
                dr.text((px + ci * cw, bt + py + ri * rs), txt, font=f_body, fill=WHITE)

        alerts = [m for cond, m in [
            (p_alert, "PLEASE CORRECT YOUR POSTURE!"),
            (d_alert, "WAKE UP! EYES CLOSED!"),
            (break_due, "TIME FOR A BREAK! STAND UP & REST EYES"),
        ] if cond]
        dr.text((px, bt + py + 3 * rs), "  |  ".join(alerts) or "Alerts: None", font=f_alert, fill=WHITE)

        frame = cv2.cvtColor(np.array(Image.alpha_composite(pil, ov).convert("RGB")), cv2.COLOR_RGB2BGR)
        cv2.imshow(WIN, frame)

        k = cv2.waitKey(1) & 0xFF
        if k == ord('q'):
            shutdown.set(); break
        elif k == ord('f'):
            is_fs = not is_fs
            cv2.setWindowProperty(WIN, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN if is_fs else cv2.WINDOW_NORMAL)
        elif k in (ord('m'), ord('M')):
            (cmds_on.clear() if cmds_on.is_set() else cmds_on.set())
            print(f"Voice commands {'unmuted' if cmds_on.is_set() else 'muted'}.")
finally:
    shutdown.set(); cap.release(); cv2.destroyAllWindows(); pose.close(); face_mesh.close()
    print("System closed.")