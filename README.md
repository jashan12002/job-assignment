# User Authentication System

A secure authentication system built with Node.js, Express, and PostgreSQL. This system provides user registration, login functionality, and profile management with modern security features.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL
- npm (comes with Node.js)
- A Google reCAPTCHA account

## Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd user-auth-system
```

2. Install dependencies
```bash
npm install
```

3. Create a PostgreSQL database and run the following SQL:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Create `.env` file in the root directory with the following variables:
```env
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
PORT=3000
```

## Running the Application

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── app.js           # Main application file
├── views/           # EJS templates
│   ├── login.ejs
│   ├── register.ejs
│   ├── profile.ejs
│   └── layout.ejs
├── package.json     # Project dependencies
└── .env            # Environment variables
```

## Technologies Used

- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Template Engine**: EJS
- **Authentication**: JWT tokens
- **Security**: bcrypt, express-rate-limit, reCAPTCHA
- **Frontend**: Bootstrap 5

## Security Features

- Password hashing with bcrypt
- JWT authentication with HTTP-only cookies
- Rate limiting on login attempts
- reCAPTCHA protection
- Input validation and sanitization

## Available Routes

- `GET /` - Home/Login page
- `GET /register` - Registration page
- `GET /login` - Login page
- `GET /profile` - Protected profile page
- `POST /register` - User registration
- `POST /login` - User authentication
- `POST /logout` - User logout

