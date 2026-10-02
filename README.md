# Mini CRM - Client Lead Management System

A clean, responsive, and functional Client Lead Management System (Mini CRM) designed to capture leads from public contact forms and manage them efficiently in an authenticated Admin Portal.

---

## Features

### 1. Public Contact Form (`/contact`)
- Simple, user-friendly contact form with field validation:
  - Full Name (required)
  - Email Address (required, valid format)
  - Phone Number
  - Company
  - Message (required)
  - Lead Source (dropdown: Website, Social Media, Google, Referral, etc.)
- Automatically saves new leads in MongoDB with initial status `"New"`.
- Instant success feedback with a confirmation card.

### 2. Admin Authentication (`/admin/login`)
- Secure login using **JWT (JSON Web Tokens)** and **bcryptjs** password hashing.
- Route protection: `/admin/*` routes redirect unauthenticated users to `/admin/login`.
- Auto-seeded default admin credentials for quick evaluation.

### 3. Admin Dashboard (`/admin/dashboard`)
- 4 real-time KPI metric cards:
  - **Total Leads**
  - **New Leads**
  - **Contacted Leads**
  - **Converted Leads**
- Quick **Recent Leads** table showing latest submissions with direct link to view details.
- Clean sidebar navigation: **Dashboard**, **Leads**, **Logout**.

### 4. Leads Management (`/admin/leads`)
- Comprehensive table displaying Name, Email, Phone, Company, Source, Status, and Created Date.
- Color-coded status badges:
  - `New` (Blue)
  - `Contacted` (Amber)
  - `Converted` (Emerald)
- Real-time search box (searches by Name, Email, Company, Message).
- Status dropdown filter (`All`, `New`, `Contacted`, `Converted`).
- **+ Add Lead**: Admin can manually insert a new lead directly into MongoDB.
- **Edit Lead**: Admin can edit lead details.
- **Delete Lead**: Safe deletion with confirmation modal (*"Are you sure you want to delete this lead? [Cancel] [Delete]"*).

### 5. Lead Details & Pipeline (`/admin/leads/:id`)
- Complete view of client details, message, and contact information.
- Quick status switcher (toggle between `New`, `Contacted`, and `Converted`).
- **Notes Section**: Add timestamped interaction notes (e.g., *"Called client and discussed pricing"*).
- **Follow-up Section**: Schedule follow-ups with date and reminder note (e.g., Date: `2026-10-09`, Note: *"Call client regarding quotation"*).

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Lucide React (Icons), Modern Responsive CSS
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `dotenv`
- **Database**: MongoDB with Mongoose ODM

---

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` (or a MongoDB Atlas connection string)

### 1. Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Default `.env` contents:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/crm_db
   JWT_SECRET=super_secret_crm_jwt_key_2026
   ADMIN_EMAIL=admin@crm.com
   ADMIN_PASSWORD=admin123
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The server will start on `http://localhost:5000` and automatically seed the default admin account if not already present.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   - Public Contact Form: `http://localhost:3000/contact`
   - Admin Login: `http://localhost:3000/admin/login`

---

## Admin Login Information

| Role | Email | Password |
|------|-------|----------|
| Default Admin | `admin@crm.com` | `admin123` |

*(These credentials are created automatically on the first server start).*

---

## API Endpoints Reference

### Public API
- `POST /api/leads/contact` - Submit public contact inquiry form

### Admin Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)

### Protected Admin APIs (Requires `Authorization: Bearer <token>`)
- `GET /api/dashboard/stats` - Summary counts & recent leads
- `GET /api/leads?search=&status=` - List all leads with search & status filters
- `GET /api/leads/:id` - Get specific lead by ID
- `POST /api/leads` - Manually create new lead
- `PUT /api/leads/:id` - Edit lead information
- `DELETE /api/leads/:id` - Delete lead
- `PATCH /api/leads/:id/status` - Update lead status (`New`, `Contacted`, `Converted`)
- `POST /api/leads/:id/notes` - Add a note to a lead
- `POST /api/leads/:id/followups` - Schedule a follow-up for a lead
