
const API_URL = "/api/students";

const studentForm = document.getElementById("student-form");
const studentIdInput = document.getElementById("student-id");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const ageInput = document.getElementById("age");
const courseInput = document.getElementById("course");

const studentList = document.getElementById("student-list");
const studentCount = document.getElementById("student-count");
const formTitle = document.getElementById("form-title");
const submitButton = document.getElementById("submit-button");
const cancelEditButton = document.getElementById("cancel-edit");
const formMessage = document.getElementById("form-message");
const listMessage = document.getElementById("list-message");
const refreshButton = document.getElementById("refresh-button");

let students = [];

// Display a message to the user.
function showMessage(element, message, type = "") {
    element.textContent = message;
    element.className = type ? `message-${type}` : "";
}

// Create a table cell safely.
function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    return cell;
}

// Load students from the API.
async function loadStudents() {
    listMessage.textContent = "";
    studentList.replaceChildren();

    const loadingRow = document.createElement("tr");
    const loadingCell = document.createElement("td");
    loadingCell.colSpan = 5;
    loadingCell.textContent = "Loading student records...";
    loadingRow.appendChild(loadingCell);
    studentList.appendChild(loadingRow);

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load student records.");
        }

        students = await response.json();
        renderStudents();
    } catch (error) {
        studentList.replaceChildren();
        studentCount.textContent = "—";
        showMessage(
            listMessage,
            "Could not load students. Check that the server is running.",
            "error"
        );
    }
}

// Display student records in the table.
function renderStudents() {
    studentList.replaceChildren();
    studentCount.textContent = students.length;

    if (students.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.textContent = "No students found. Add your first student above.";
        row.appendChild(cell);
        studentList.appendChild(row);
        return;
    }

    students.forEach((student) => {
        const row = document.createElement("tr");

        row.appendChild(
            createCell(`${student.firstName} ${student.lastName}`)
        );
        row.appendChild(createCell(student.email));
        row.appendChild(createCell(student.age));
        row.appendChild(createCell(student.course));

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editStudent(student._id));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () =>
            deleteStudent(student._id)
        );

        actions.append(editButton, deleteButton);
        actionsCell.appendChild(actions);
        row.appendChild(actionsCell);
        studentList.appendChild(row);
    });
}

// Reset the form to add mode.
function resetForm() {
    studentForm.reset();
    studentIdInput.value = "";
    formTitle.textContent = "Add New Student";
    submitButton.textContent = "Add Student";
    cancelEditButton.hidden = true;
}

// Fill the form with the selected student's details.
function editStudent(id) {
    const student = students.find((item) => item._id === id);

    if (!student) {
        showMessage(formMessage, "Student record not found.", "error");
        return;
    }

    studentIdInput.value = student._id;
    firstNameInput.value = student.firstName;
    lastNameInput.value = student.lastName;
    emailInput.value = student.email;
    ageInput.value = student.age;
    courseInput.value = student.course;

    formTitle.textContent = "Edit Student";
    submitButton.textContent = "Save Changes";
    cancelEditButton.hidden = false;

    showMessage(formMessage, "Update the details and save your changes.");
    document.getElementById("student-form-panel").scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

// Add a student or update an existing student.
studentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = studentIdInput.value;
    const studentData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        age: Number(ageInput.value),
        course: courseInput.value.trim(),
    };

    if (
        !studentData.firstName ||
        !studentData.lastName ||
        !studentData.email ||
        !studentData.course ||
        !Number.isInteger(studentData.age) ||
        studentData.age < 1 ||
        studentData.age > 120
    ) {
        showMessage(
            formMessage,
            "Enter valid details in all fields. Age must be between 1 and 120.",
            "error"
        );
        return;
    }

    submitButton.disabled = true;
    showMessage(formMessage, id ? "Updating student..." : "Adding student...");

    try {
        const response = await fetch(id ? `${API_URL}/${id}` : API_URL, {
            method: id ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "The operation failed.");
        }

        showMessage(
            formMessage,
            result.message || "Student saved successfully.",
            "success"
        );

        resetForm();
        await loadStudents();
    } catch (error) {
        showMessage(formMessage, error.message, "error");
    } finally {
        submitButton.disabled = false;
    }
});

// Delete a student after confirmation.
async function deleteStudent(id) {
    const student = students.find((item) => item._id === id);

    if (!student) {
        showMessage(listMessage, "Student record not found.", "error");
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to delete ${student.firstName} ${student.lastName}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to delete student.");
        }

        showMessage(
            listMessage,
            result.message || "Student deleted successfully.",
            "success"
        );

        if (studentIdInput.value === id) {
            resetForm();
        }

        await loadStudents();
    } catch (error) {
        showMessage(listMessage, error.message, "error");
    }
}

// Event listeners.
cancelEditButton.addEventListener("click", () => {
    resetForm();
    showMessage(formMessage, "");
});

refreshButton.addEventListener("click", loadStudents);

// Load records when the page opens.
loadStudents();
