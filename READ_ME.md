# PetRescue App 🐾

A full-stack, comprehensive web application designed to streamline the reporting, tracking, and hand-over process for missing and found pets between community members, pet owners, and SPCA managers.

### 🎓 Academic Project

This project was developed for our **Information Systems (INF)** module by:

- **Bavuma Kamvelihle**
- **Makaula Melisa**
- **Mangena Tebatso**

---

## 📖 Project Overview

The PetRescue App provides a secure, role-based platform that connects the community to animal welfare organizations. The system features three distinct user workflows:

1. **Pet Owners:** Can report their pets missing, track their status, and schedule pick-ups when their pet is found and secured at a shelter.
2. **Community Members:** Can report found pets, automatically linking them to missing reports, and log drop-off requests to hand the pet over to an SPCA branch.
3. **SPCA Managers:** Access a dedicated dashboard to manage their branch's missing/found feeds, approve community intake drop-offs, and authorize final release handovers back to the owners.

**Key Technologies:**

- **Frontend:** React, TypeScript, Tailwind CSS, React Query (TanStack), Axios
- **Backend:** Node.js, Express.js, MySQL, JSON Web Tokens (JWT) for secure authentication

---

## ⚙️ Installation & Setup Guide

This project is split into two directories: `frontend` and `backend`. You will need two separate terminal windows running simultaneously to start the application.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- A local or cloud MySQL database server.

### 1. Database Setup

1. Open your MySQL Workbench.
2. Execute the provided SQL scripts in the `database` folder (if applicable) to create the schema, tables, and seed data.

### 2. Backend Setup

Open a terminal and follow these steps to start the API server:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create your environment variables file
# Rename .env.example to .env and fill in your MySQL credentials and JWT secret
cp .env.example .env

# Start the development server
npm run dev
```
