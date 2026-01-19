 📊 Product Analytics Dashboard

A full-stack **self-tracking product analytics dashboard** that visualizes its own usage.
Every interaction (filter changes, chart clicks) is tracked, stored in the database, and reflected back in the analytics.

> Built as a practical full-stack coding challenge submission.

---

## ✨ Key Features

* 🔐 Authentication (JWT-based login/register)
* 📊 Interactive dashboard with:

  * Bar chart (clicks per feature)
  * Line chart (clicks over time)
* 🎛 Filters:

  * Date range
  * Age range
  * Gender
* 🧠 Self-tracking loop:

  * Changing filters and clicking charts generates events
  * Events are persisted in database
  * Charts re-aggregate based on stored events
* 💾 Persistent filters using cookies
* 🌐 Deployed architecture

---

## 🧠 Core Requirement Satisfied

> “This dashboard visualizes its own usage.”

This is implemented as :

```
User Interaction
   ↓
/track API (event stored in DB)
   ↓
/analytics API (aggregates from DB)
   ↓
Charts re-render with updated data
```

**Note on filters:**
Analytics respect demographic filters (age, gender).
Newly tracked events only appear in charts when the active filters include the current user's demographics.
This reflects realistic analytics behavior.

---

## 🏗 Architecture

```
Frontend (React + Vite) → Vercel
        ↓ API calls
Backend (Node.js + Express + Prisma) → Render
        ↓
Database (PostgreSQL) → Supabase
```

## 🧰 Tech Stack

### Frontend

* React (Vite)
* Recharts (charts)
* Axios
* date-fns
* js-cookie

### Backend

* Node.js + Express
* Prisma ORM
* JWT authentication
* bcrypt

### Database

* PostgreSQL (Supabase)

### Deployment

* Frontend → Vercel
* Backend → Render
* Database → Supabase

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd product-analytics-dashboard
```

---

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```env
DATABASE_URL="your-postgres-url"
DIRECT_URL="your-direct-postgres-url"
JWT_SECRET="your-secret"
PORT=3001
NODE_ENV=development
```

Run migrations and seed:

```bash
npx prisma db push
npm run seed
npm run dev
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

Run frontend:

```bash
npm run dev
```

---

## 🔑 Sample Users (after seeding)

Password for all users:

```
password123
```

Example usernames:

```
adult_male
adult_female
teen_male
teen_female
senior_male
senior_female
other_young
other_old
```

---

## 🧪 Testing the Self-Tracking Behavior

You can verify the loop works:

1. Open dashboard
2. Open Prisma Studio:

   ```bash
   npx prisma studio
   ```
3. Change a filter (e.g., age or gender)
4. Observe a new row added to `feature_clicks`
5. Watch charts update after refetch

This confirms:

> Interaction → DB insert → Aggregation → Visualization

---


## 📂 Folder Structure

```
/frontend
  /components
  /pages
  /services
/backend
  /src/controllers
  /src/services
  /src/routes
  /prisma
```

---

## 👤 Author

**Hamza Gandhi**
Full-stack developer 

---

