const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'Rohit@123',  // Change to your MySQL password
    database: 'online_exam_db'
});

db.connect((err) => {
    if (err) { console.error('Error connecting to MySQL:', err); return; }
    console.log('Connected to MySQL Database');
});

// ================= API ROUTES =================

// 1. GET: Fetch all courses
app.get('/api/courses', (req, res) => {
    db.query('SELECT * FROM courses', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});



// 2. Update the POST course route
app.post('/api/courses', (req, res) => {
    const { title, subject, description, thumbnail_url, video_url, pdf_url } = req.body;
    const teacherId = 1; 
    
    const query = "INSERT INTO courses (teacher_id, title, subject, description, thumbnail_url, video_url, pdf_url, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)";
    db.query(query, [teacherId, title, subject, description, thumbnail_url || 'https://via.placeholder.com/300x150/3b82f6/ffffff?text=Course', video_url, pdf_url], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, message: "Course created successfully" });
    });
});

// 3. GET: Fetch all exams
app.get('/api/exams', (req, res) => {
    db.query('SELECT * FROM exams', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 4. POST: Create an exam
app.post('/api/exams', (req, res) => {
    const { course_id, title, subject, duration_minutes, total_marks, passing_percentage, exam_date } = req.body;
    const query = "INSERT INTO exams (course_id, title, subject, duration_minutes, total_marks, passing_percentage, exam_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [course_id, title, subject, duration_minutes, total_marks, passing_percentage, exam_date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, message: "Exam created successfully" });
    });
});

// 5. POST: Add MCQ Question
app.post('/api/questions', (req, res) => {
    const { exam_id, question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;
    const query = "INSERT INTO questions (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [exam_id, question_text, option_a, option_b, option_c, option_d, correct_option], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, message: "Question added successfully" });
    });
});
// --- ADD THESE ROUTES TO server/server.js ---

// 1. Get Certificates
app.get('/api/certificates/:studentId', (req, res) => {
    db.query('SELECT * FROM certificates WHERE student_id = ?', [req.params.studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Edit/Update a Course
app.put('/api/courses/:id', (req, res) => {
    const { title, subject, description, thumbnail_url, video_url, pdf_url } = req.body;
    const query = "UPDATE courses SET title=?, subject=?, description=?, thumbnail_url=?, video_url=?, pdf_url=? WHERE id=?";
    
    db.query(query, [title, subject, description, thumbnail_url, video_url, pdf_url, req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Course updated successfully" });
    });
});

// 3. Delete a Course
app.delete('/api/courses/:id', (req, res) => {
    // First delete linked exams/questions to avoid foreign key errors
    db.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Course deleted successfully" });
    });
});
// --- ADD THESE TO YOUR server.js ---

// 1. GET: Fetch a single exam by ID
app.get('/api/exams/:id', (req, res) => {
    db.query('SELECT * FROM exams WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Exam not found" });
        res.json(results[0]);
    });
});

// 2. GET: Fetch questions for a specific exam
app.get('/api/exams/:id/questions', (req, res) => {
    db.query('SELECT * FROM questions WHERE exam_id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. POST: Submit Exam Result
app.post('/api/results', (req, res) => {
  const { student_id, exam_id, score, total_marks } = req.body;

  if (!student_id || !exam_id || score === undefined || !total_marks) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = "INSERT INTO results (student_id, exam_id, score, total_marks) VALUES (?, ?, ?, ?)";
  
  // Use 'db.query' instead of 'pool.query', and pass the 'query' variable
  db.query(query, [student_id, exam_id, score, total_marks], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.status(201).json({ message: "Result saved successfully", resultId: result.insertId });
  });
});
// --- ADD THESE ROUTES TO server.js ---

// 1. GET: Fetch only the courses the student is ENROLLED in (for the Dashboard)
// GET: Fetch ONLY the courses the student is ENROLLED in, INCLUDING PROGRESS
app.get('/api/student/:studentId/enrolled-courses', (req, res) => {
    const query = `
        SELECT c.*, e.progress FROM courses c
        INNER JOIN enrollments e ON c.id = e.course_id
        WHERE e.student_id = ?
    `;
    db.query(query, [req.params.studentId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. POST: Enroll a student into a course
app.post('/api/enroll', (req, res) => {
    const { student_id, course_id } = req.body;
    
    const query = "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)";
    db.query(query, [student_id, course_id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "You are already enrolled in this course." });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Successfully enrolled!", enrollmentId: result.insertId });
    });
});

// Mark course as completed
// app.post('/api/student/complete-course', (req, res) => {
//     const { student_id, course_id } = req.body;
    
//     const query = "UPDATE enrollments SET progress = 100 WHERE student_id = ? AND course_id = ?";
//     db.query(query, [student_id, course_id], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Course completed successfully!" });
//     });
// });
// Mark course as completed (Upsert approach so it never fails even if enrollment row is missing)
// Mark course as completed (Upsert approach)
// Mark course as completed (Upsert approach)
app.post('/api/student/complete-course', (req, res) => {
    const { student_id, course_id } = req.body;
    
    if (!student_id || !course_id) {
        return res.status(400).json({ message: "Missing student_id or course_id" });
    }

    const query = `
        INSERT INTO enrollments (student_id, course_id, progress) 
        VALUES (?, ?, 100)
        ON DUPLICATE KEY UPDATE progress = 100
    `;
    
    db.query(query, [student_id, course_id], (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
        }
        res.json({ message: "Course completed successfully!" });
    });
});
// POST: Register a new user (Student or Teacher)
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const tableName = role === 'teacher' ? 'teachers' : 'students';

    // Check if email already exists
    const checkQuery = `SELECT * FROM ${tableName} WHERE email = ?`;
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Insert new user
        const insertQuery = `INSERT INTO ${tableName} (name, email, password) VALUES (?, ?, ?)`;
        db.query(insertQuery, [name, email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Registration successful", userId: result.insertId });
        });
    });
});
// POST: Login
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;

    const tableName = role === 'teacher' ? 'teachers' : 'students';

    const query = `SELECT * FROM ${tableName} WHERE email = ? AND password = ?`;
    db.query(query, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Return user data (excluding password for security)
        const user = results[0];
        delete user.password;

        res.json({ 
            message: "Login successful",
            user: user,
            role: role
        });
    });
});
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});