# hafsa-tools

Exam preparation tools for Dr. Hafsa.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript
- **Database**: SQLite via Drizzle ORM
- **Auth**: Password-protected, single user

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Generate and run database migrations
cd server
npm run db:generate
npm run db:migrate

# Start development (frontend + backend)
cd ..
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend on port `3001`.

On first visit, you'll be prompted to set a password. After that, use it to log in.
