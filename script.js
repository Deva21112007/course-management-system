const API_URL = "http://localhost:3000/api/courses";


// Add Course
document.getElementById("courseForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const course = {
        course_name: document.getElementById("courseName").value,
        course_code: document.getElementById("courseCode").value,
        instructor: document.getElementById("instructor").value,
        department: document.getElementById("department").value,
        duration: document.getElementById("duration").value,
        fees: document.getElementById("fees").value
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(course)
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            document.getElementById("courseForm").reset();
            loadCourses();
        } else {
            alert(data.message);
        }

    } catch (error) {
        alert("Unable to connect to backend");
        console.error(error);
    }
});


// Display Courses
async function loadCourses() {

    try {

        const response = await fetch(API_URL);
        const courses = await response.json();

        const tableBody = document.querySelector("#courseTable tbody");

        tableBody.innerHTML = "";

        courses.forEach(course => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.course_id}</td>
                <td>${course.course_name}</td>
                <td>${course.course_code}</td>
                <td>${course.instructor}</td>
                <td>${course.department}</td>
                <td>${course.duration}</td>
                <td>${course.fees}</td>
                <td>
                    <button onclick="deleteCourse(${course.course_id})">
                        Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error(error);
    }
}


// Delete Course
async function deleteCourse(id) {

    if (!confirm("Are you sure you want to delete this course?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        alert(data.message);

        loadCourses();

    } catch (error) {
        alert("Unable to connect to backend");
        console.error(error);
    }
}


// Load courses when page opens
loadCourses();