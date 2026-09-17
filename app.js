const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// HOME
app.get("/", (req, res) => {
    res.send("Course Management System Backend is Running");
});


// TEST DATABASE
app.get("/test-db", (req, res) => {
    db.query("SELECT 1", (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database connection failed"
            });
        }

        res.json({
            message: "Database connection successful"
        });
    });
});


// CREATE - Add Course
app.post("/api/courses", (req, res) => {

    const {
        course_name,
        course_code,
        instructor,
        department,
        duration,
        fees
    } = req.body;

    const sql = `
        INSERT INTO courses
        (course_name, course_code, instructor, department, duration, fees)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [course_name, course_code, instructor, department, duration, fees],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to add course",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Course added successfully",
                course_id: result.insertId
            });
        }
    );
});


// READ - Get All Courses
app.get("/api/courses", (req, res) => {

    const sql = "SELECT * FROM courses";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch courses",
                error: err.message
            });
        }

        res.json(results);
    });
});


// UPDATE - Update Course
app.put("/api/courses/:id", (req, res) => {

    const course_id = req.params.id;

    const {
        course_name,
        course_code,
        instructor,
        department,
        duration,
        fees
    } = req.body;

    const sql = `
        UPDATE courses
        SET course_name = ?,
            course_code = ?,
            instructor = ?,
            department = ?,
            duration = ?,
            fees = ?
        WHERE course_id = ?
    `;

    db.query(
        sql,
        [
            course_name,
            course_code,
            instructor,
            department,
            duration,
            fees,
            course_id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to update course",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            res.json({
                message: "Course updated successfully"
            });
        }
    );
});

// DELETE - Delete Course
app.delete("/api/courses/:id", (req, res) => {

    const course_id = req.params.id;

    const sql = "DELETE FROM courses WHERE course_id = ?";

    db.query(sql, [course_id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to delete course",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json({
            message: "Course deleted successfully"
        });
    });
});
// SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});