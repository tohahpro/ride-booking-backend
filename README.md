
# Ride Booking API

A secure and scalable **Ride Booking API** built with **Express.js**, **TypeScript**, and **MongoDB**. This project was developed as part of **Assignment 5**.

---

## 📌 Features
- 🔑 **Authentication & Authorization** with JWT & Refresh Tokens
- 👤 **Role-based access control** (Rider, Driver, Admin)
- 🚕 **Ride Management**
  - Request a ride
  - Cancel a ride
  - Track ride status (`requested`, `accepted`, `picked_up`, `in_transit`, `completed`, `canceled`,`paid`)
- 📍 **Geo-based Driver Search** using MongoDB **2dsphere index**
- 💰 **Driver Earnings** tracking
- ⭐ **Driver Rating System**
- 🔒 Secure password hashing with **bcryptjs**
- ✅ Input validation with **Zod**

---

## ⚙️ Tech Stack
- **Backend Framework**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Utilities**: cookie-parser, cors, dotenv, http-status-codes

---

## 🗂️ Project Structure
```bash
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── ride/
│   ├── driver/
│   └── admin/
├── middleware/
├── utils/
├── app.ts
└── server.ts
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/tohahpro/ride-booking-backend.git
cd ride-booking-backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root directory and add:
```env
DB_URL = mongodb://localhost:27017/
PORT = 3000
NODE_DEV = development
bcrypt_salt_round = 10


# JWT
jwt_secret = G5f8Q1z8W3e9R2t6Y4u7K8j9L0mN5pQ3sT6vB7xY8z34dfr
jwt_expires = 30d
jwt_refresh_secret = H7jK8l9M0nP5qR3sT6vB7xY8zA1cD2eF3gH46dr
jwt_refresh_expires = 60d
```

### 4️⃣ Run the Server
```bash
npm run dev
```

---

## 📡 API Endpoints
# 📌 API Endpoints Summary

## 🔑 Authentication Routes

| Method | Endpoint              | Description         | Role     |
| ------ | --------------------- | ------------------- | -------- |    
| POST   | `/auth/login`         | Login and get JWT   | Public   |
| POST   | `/auth/change-password` | Change Password   | Any Role   |
| POST   | `/auth/logout`        | Logout user         | Any Role |

---

## 👤 User Routes

| Method | Endpoint                    | Description        | Role         |
| ------ | --------------------------- | ------------------ | ------------ |
| POST   | `/user/register`      | Register a new user | Public   |
| GET    | `/user/me`                 | Get own profile    | Any          |
| PATCH  | `/user/updateProfile`   | Update own profile | Any Role     |


---

## 🚖 Driver Routes

| Method | Endpoint                  | Description         | Role   |
| ------ | ------------------------- | ------------------- | ------ |
| POST   | `/driver/create-driver`   | Create a new driver | Public |
| POST   | `/driver/accept-ride`   | Requested ride accept or reject | Driver |
| GET    | `/driver/history` | Get driver earnings | Driver |
| PATCH  | `/driver/status-update` | Set ride status | Driver|
| PATCH  | `/driver/changeOnlineStatus` | Set online/offline | Driver|

---

## 🛺 Ride Routes

| Method | Endpoint                          | Description                  | Role   |
| ------ | --------------------------------- | ---------------------------- | ------ |
| POST   | `/ride/request-ride`              | Request a new ride           | Rider  |
| GET    | `/ride/history`                   | Get rider’s ride history     | Rider  |
| PATCH  | `/ride/:id/cancel-ride/:id`       | Cancel a ride                | Rider  |
| GET    | `/ride/available-ride`            | Get available rides          | Driver |
| PATCH  | `/ride/feedback/:id`              | Update ride status           | Rider |

---

## 🛠️ Admin Routes

| Method | Endpoint                         | Description            | Role  |
| ------ | -------------------------------- | ---------------------- | ----- |
| GET    | `/admin/getAllUser`              | Get all users          | Admin |
| GET    | `/admin/getAllRide`              | Get all rides          | Admin |
| PATCH  | `/admin/changeIsApproveStatus/:id` | Approve/suspend driver | Admin |
| PATCH  | `/admin/updateActiveStatus/:id` | Active/Inactive driver | Admin |
| PATCH  | `/admin/changeBlockStatus/:id` | Blocked/Unblocked driver | Admin |

---



