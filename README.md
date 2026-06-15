# IdeaVault – Startup Idea Sharing Platform

IdeaVault is a modern web application where users can share startup ideas, explore ideas posted by others, and engage through comments and discussions. The platform encourages creativity, collaboration, and validation of ideas through community interaction.

## Live Site

- Live URL: https://your-ideavault-live-url.vercel.app (update after deployment)

## Features

- 🔐 Firebase Authentication with JWT-protected private routes
- 💡 Create, update, delete, and explore startup ideas with rich details
- 🔍 Search ideas by title and filter by category or date range
- 💬 Comment system with add, edit, and delete own comments
- 📈 Trending ideas section based on likes, comments, and recency
- 🌗 Dark / light theme toggle with persistent preference
- 📱 Fully responsive design using Tailwind CSS and DaisyUI
- 🚀 Clean component architecture ready to connect to a MongoDB Atlas backend

## Tech Stack

- **Framework:** Next.js (Pages Router)
- **Language:** JavaScript / JSX
- **Styling:** Tailwind CSS + DaisyUI
- **Auth:** Firebase Authentication
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **Icons:** React Icons

## Getting Started

1. Copy `.env.local.example` to `.env.local` and fill in your Firebase + backend details.
2. Set `NEXT_PUBLIC_USE_DEMO=true` to run the UI without a backend, or `false` once your Express + MongoDB server is ready.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Notes

This frontend expects a Node.js/Express backend with the following endpoints (replace with your actual implementation):

- `POST /auth/jwt` – exchange Firebase ID token for an app JWT
- `GET /ideas` – list/search/filter ideas
- `GET /ideas/trending` – trending ideas
- `GET /ideas/:id` – single idea details
- `POST /ideas` – create idea
- `PUT /ideas/:id` – update idea
- `DELETE /ideas/:id` – delete idea
- `GET /ideas/my` – current user ideas
- `GET /users/interactions` – ideas the user commented on
- `GET/POST /ideas/:id/comments` – comment CRUD
- `POST /ideas/:id/like`, `POST /bookmarks/:id` – engagement endpoints

MongoDB Atlas connection strings and Firebase credentials should be stored in environment variables on the server side.
