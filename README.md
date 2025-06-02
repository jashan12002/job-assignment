# User Authentication System

A secure authentication system built with Node.js, Express, and PostgreSQL. This system provides user registration, login functionality, and profile management with modern security features.

## Features


- User registration with unique username and email validation
- Secure login with Google reCAPTCHA protection
- JWT-based authentication
- Protected profile routes
- Password hashing with bcrypt
- Rate limiting for enhanced security
- PostgreSQL database for data persistence

## Project Structure

```
project-root/
├── src/
│   ├── config/
│   │   └── database.js         # Database configuration
│   ├── controllers/
│   │   └── userController.js   # User-related controllers
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   └── userRoutes.js      # Route definitions
│   ├── views/
│   │   ├── partials/
│   │   │   ├── header.ejs     # Common header template
│   │   │   └── footer.ejs     # Common footer template
│   │   ├── login.ejs          # Login page
│   │   ├── register.ejs       # Registration page
│   │   ├── profile.ejs        # User profile page
│   │   ├── error.ejs          # Error page
│   │   └── layout.ejs         # Main layout template
│   └── app.js                 # Main application file
├── package.json               # Project dependencies
└── .env                      # Environment variables
```

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
CREATE DATABASE your_database_name;

\c your_database_name

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
# Database Configuration
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Google reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Server Configuration
PORT=3000
```

## Setting up Google reCAPTCHA

1. Go to https://www.google.com/recaptcha/admin
2. Register a new site
3. Choose reCAPTCHA v2 "I'm not a robot" Checkbox
4. Add your domain (use localhost for development)
5. Copy the Site Key and Secret Key to your .env file

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

## Available Routes

- `GET /` - Home/Login page
- `GET /register` - Registration page
- `POST /register` - Create new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /profile` - Protected profile page (requires authentication)
- `GET /logout` - Logout user

## Security Features

- Password hashing with bcrypt
- JWT authentication with HTTP-only cookies
- Rate limiting on login attempts
- Google reCAPTCHA protection
- Input validation and sanitization
- Secure session management
- Protection against common web vulnerabilities

## Error Handling

The application includes comprehensive error handling for:
- Database connection issues
- Invalid credentials
- Duplicate username/email
- Invalid reCAPTCHA responses
- Authentication failures
- Server errors

## Development

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

