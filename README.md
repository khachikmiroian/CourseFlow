# CourseFlow

**Project Description**:  
CourseFlow is a web application designed for managing and delivering online courses. Users can browse available courses, enroll in them, and access course content. Administrators can create, update, and delete courses. The platform uses server‑side rendering with Express‑Handlebars to dynamically generate pages and offers robust session management and security features.

## Technologies Used

- **Programming Language**: JavaScript (ES6+)
- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Templating Engine**: Express‑Handlebars
- **Database**: MongoDB (using Mongoose)
- **Session Management**: express‑session and connect‑mongodb‑session
- **Security**: Helmet, csurf, connect‑flash
- **File Uploads**: Multer
- **Compression**: compression

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)
- Git

### Setup Steps

1. **Clone the repository:**

    ```bash
    git clone https://github.com/khachikmiroian/CourseFlow.git
    cd CourseFlow
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root directory of the project and add the following environment variables (replace placeholder values with your own):

    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    SESSION_SECRET=your_session_secret
    EMAIL_FROM=your_email@example.com
    BASE_URL=https://your-app-domain.com
    ```

4. **Run the application:**

    ```bash
    npm start
    ```

   The application will start on the port specified in the `.env` file (default is 3000).

## Features

- **Course Management**: Administrators can add, update, and delete courses.
- **User Enrollment**: Users can enroll in courses and access course materials.
- **Server-Side Rendering**: Uses Express‑Handlebars for dynamic page generation.
- **User Sessions**: Managed via express‑session with session data stored in MongoDB.
- **Security Measures**: Helmet and csurf protect the application from common web vulnerabilities, and connect‑flash provides notification messages.
- **File Uploads**: Supports uploading files (e.g., course images) using Multer.
- **Compression**: Response data is compressed to improve performance.

## Project Structure

- **models**: Mongoose models representing the data structures.
- **routes**: Express routes for different parts of the application (home, courses, authentication, profile, etc.).
- **views**: Express‑Handlebars templates for rendering pages.
- **public**: Static files such as CSS, JavaScript, and images.
- **middleware**: Custom middleware for session management, error handling, file uploads, and other functionalities.

## Environment Variables

The project requires several environment variables to run correctly. These include:

- `PORT` – The port number on which the server runs (default is 3000).
- `MONGODB_URI` – The MongoDB connection string.
- `SESSION_SECRET` – A secret key used for session encryption.
- `EMAIL_FROM` – The email address from which notifications are sent.
- `BASE_URL` – The base URL of the application (used in generating links and emails).
