# Task Manager Application

This repository contains both the frontend and backend code for the Task Manager application.

## Project Structure

- `/backend`: Express.js backend API with TypeScript
- `/frontend`: Frontend application 

## Development Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Add your frontend startup command here
```

## Code Quality

This project uses Husky to enforce code quality on each commit. The following checks are run automatically:

- ESLint for code linting
- Prettier for code formatting

You can manually run these checks:

```bash
# Run all linting
npm run lint

# Run all formatting
npm run format

# Run linting only for backend
npm run lint:backend

# Run formatting only for backend
npm run format:backend

# Run linting only for frontend
npm run lint:frontend

# Run formatting only for frontend
npm run format:frontend
```
