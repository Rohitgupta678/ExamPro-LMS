from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import mediapipe as mp
import time

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

mp_pose = mp.solutions.pose
mp_face_mesh = mp.solutions.face_mesh
mp_face_detection = mp.solutions.face_detection

pose = mp_pose.Pose(min_detection_confidence=0.5)
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=2, min_detection_confidence=0.5)
face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.5)

# Timing variables
missing_start = time.time()
posture_start = time.time()
look_away_start = time.time()
talk_start = time.time()

# Landmarks
NOSE_TIP = 1
MOUTH_TOP, MOUTH_BOTTOM = 13, 14

@app.post("/analyze_frame")
async def analyze_frame(file: UploadFile = File(...)):
    global missing_start, posture_start, look_away_start, talk_start
    
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if frame is None: return {"status": "Active", "warning": None}

    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    now = time.time()

    # 1. CHECK IF FACE IS MISSING (Hand cover / Left seat)
    face_res = face_detection.process(rgb)
    num_faces = len(face_res.detections) if face_res.detections else 0

    if num_faces == 0:
        if now - missing_start > 2.0: # 2 seconds grace
            return {"status": "Face Missing", "warning": "Warning! Face not visible or you left the seat."}
        return {"status": "Checking...", "warning": None}
    else:
        missing_start = now # Reset timer

    if num_faces > 1:
        return {"status": "Multiple People", "warning": "Warning! Multiple people detected."}

    # 2. CHECK POSTURE
    p_res = pose.process(rgb)
    if p_res.pose_landmarks:
        lm = p_res.pose_landmarks.landmark
        # Check shoulder-to-ear angle roughly
        l_shoulder = lm[mp_pose.PoseLandmark.LEFT_SHOULDER]
        r_shoulder = lm[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        l_ear = lm[mp_pose.PoseLandmark.LEFT_EAR]
        r_ear = lm[mp_pose.PoseLandmark.RIGHT_EAR]
        
        # Very basic posture check (if head is significantly lower than shoulders)
        if l_ear.y > l_shoulder.y - 0.1 or r_ear.y > r_shoulder.y - 0.1:
             if now - posture_start > 2.0:
                 return {"status": "Bad Posture", "warning": "Please sit properly and look at your screen."}
        else:
             posture_start = now

    # 3. CHECK HEAD TURN AND TALKING
    f_res = face_mesh.process(rgb)
    if f_res.multi_face_landmarks:
        flm = f_res.multi_face_landmarks[0].landmark
        
        # Head Turn (Nose far from center)
        nose_x = flm[NOSE_TIP].x
        if nose_x < 0.35 or nose_x > 0.65:
            if now - look_away_start > 2.0:
                return {"status": "Looking Away", "warning": "Warning! Do not look around during the exam."}
        else:
            look_away_start = now

        # Talking (Mouth open)
        mouth_dist = abs(flm[MOUTH_TOP].y - flm[MOUTH_BOTTOM].y)
        if mouth_dist > 0.04:
             if now - talk_start > 1.5:
                 return {"status": "Talking", "warning": "Please do not communicate with anyone."}
        else:
             talk_start = now

    return {"status": "Active", "warning": None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)