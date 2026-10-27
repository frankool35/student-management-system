# Student Management System

A web-based Student Management System developed as part of the Auspify Technologies Full Stack Development Internship.

## Features

- Add new student records.
- View student records stored in MongoDB Atlas.
- Update existing student information.
- Delete student records with confirmation.
- Validate required fields and student age.
- Prevent duplicate email addresses.
- Display the total number of students.
- Responsive user interface.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv

## Project Structure

```text
student-management-system/
├── models/
│   └── Student.js
├── routes/
│   └── students.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Installation and Setup

1. Install Node.js and npm.
2. Clone or download this repository.
3. Open a terminal in the project directory.
4. Install the dependencies:

   ```bash
   npm install
   ```

5. Create a `.env` file in the project root and configure your MongoDB connection:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

6. Start the application:

   ```bash
   node server.js
   ```

7. Open `http://localhost:3000` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Retrieve all students |
| GET | `/api/students/:id` | Retrieve one student |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

## Database

The application uses MongoDB Atlas with Mongoose. Student records are stored in the `internship_students` collection.

## Security

Database credentials are configured through environment variables. Do not commit the `.env` file or expose database credentials in public repositories.

## Internship Project

Developed for the Auspify Technologies Full Stack Development Internship.
