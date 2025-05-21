# Shared To-Do List Application

A full-stack application that allows users to create, manage, and share tasks with other users. Built with Node.js/Fastify backend, React frontend, PostgreSQL database, and Firebase Authentication.

## Features

- User authentication (signup, login) with Firebase
- Create, read, update, and delete tasks
- Share tasks with other users
- Filter tasks (all tasks, my tasks, shared tasks)
- Containerized with Docker for easy deployment

## Tech Stack

### Backend
- Node.js with Fastify
- PostgreSQL with Prisma ORM
- TypeScript
- JWT Authentication

### Frontend
- React
- TypeScript
- Vite
- Firebase Authentication

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) (v7 or newer)
- [PostgreSQL](https://www.postgresql.org/) (or use Docker)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/pradeep-ravan/Shared-To-Do-List.git
cd shared-todo-app
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd packages/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set up environment variables

#### Backend (.env file in packages/backend/)

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/todo_app"
JWT_SECRET="your-secure-jwt-secret"
PORT=3000
```

#### Frontend (.env file in packages/frontend/)

```
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Set up Firebase Authentication

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable Authentication and set up Email/Password sign-in method
4. Register a Web App in your Firebase project
5. Copy the Firebase configuration to your frontend .env file

### 5. Set up the database

**Option 1: Using Docker**

```bash
docker run -d --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todo_app -p 5432:5432 postgres:15-alpine
```

**Option 2: Using local PostgreSQL installation**

```bash
# Create a new database
createdb todo_app

### 6. Run database migrations

```bash
cd packages/backend
npx prisma migrate dev
```

### 7. Start the application (Development Mode)

**Backend:**

```bash
cd packages/backend
npm run dev
```

**Frontend:**

```bash
cd packages/frontend
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:3000.

## Running with Docker Compose

To run the entire application using Docker:

```bash
# Build and start all services
docker-compose up --build

# To run in detached mode
docker-compose up -d --build

# To stop the application
docker-compose down
```

The application will be available at http://localhost:80.

## Database Schema

The database schema is defined in the `dbml/schema.dbml` file and includes:

- Users table: Stores user information
- Tasks table: Stores task information
- Task shares relationship: Tracks which tasks are shared with which users

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Log in a user

### Tasks

- `GET /api/tasks`: Get all tasks (including shared)
- `GET /api/tasks/my-tasks`: Get tasks created by the user
- `GET /api/tasks/shared-tasks`: Get tasks shared with the user
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `PATCH /api/tasks/:id/toggle`: Toggle task completion status
- `DELETE /api/tasks/:id`: Delete a task
- `POST /api/tasks/share`: Share a task with another user

## Folder Structure

```
shared-todo-app/
├── dbml/
│   └── schema.dbml
├── docker-compose.yml
├── package.json
├── packages/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/
│   │       ├── controllers/
│   │       ├── middleware/
│   │       ├── routes/
│   │       └── index.ts
│   └── frontend/
│       ├── Dockerfile
│       ├── index.html
│       ├── package.json
│       └── src/
│           ├── components/
│           ├── context/
│           ├── firebase/
│           ├── pages/
│           ├── services/
│           └── App.tsx
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.