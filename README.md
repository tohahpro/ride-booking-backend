
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
| POST   | `/api/v1/auth/login`         | Login and get JWT   | Public   |
| POST   | `/api/v1/auth/change-password` | Change Password   | Any Role   |
| POST   | `/api/v1/auth/logout`        | Logout user         | Any Role |

---

## 👤 User Routes

| Method | Endpoint                    | Description        | Role         |
| ------ | --------------------------- | ------------------ | ------------ |
| POST   | `/api/v1/user/register`      | Register a new user | Public   |
| GET    | `/api/v1/user/me`                 | Get own profile    | Any          |
| PATCH  | `/api/v1/user/updateProfile`   | Update own profile | Any Role     |


---

## 🚖 Driver Routes

| Method | Endpoint                  | Description         | Role   |
| ------ | ------------------------- | ------------------- | ------ |
| POST   | `/api/v1/drivers/create-driver`   | Create a new driver | Public |
| POST   | `/api/v1/drivers/accept-ride`   | Requested ride accept or reject | Driver |
| GET    | `/api/v1/drivers/history` | Get driver earnings | Driver |
| PATCH  | `/api/v1/drivers/status-update` | Set ride status | Driver|
| PATCH  | `/api/v1/drivers/changeOnlineStatus` | Set online/offline | Driver|

---

## 🛺 Ride Routes

| Method | Endpoint                          | Description                  | Role   |
| ------ | --------------------------------- | ---------------------------- | ------ |
| POST   | `/api/v1/rides/request-ride`              | Request a new ride           | Rider  |
| GET    | `/api/v1/rides/history`                   | Get rider’s ride history     | Rider  |
| PATCH  | `/api/v1/rides/:id/cancel-ride/:id`       | Cancel a ride                | Rider  |
| GET    | `/api/v1/rides/available-ride`            | Get available rides          | Driver |
| PATCH  | `/api/v1/rides/feedback/:id`              | Update ride status           | Rider |

---

## 🛠️ Admin Routes

| Method | Endpoint                         | Description            | Role  |
| ------ | -------------------------------- | ---------------------- | ----- |
| GET    | `/api/v1/admin/getAllUser`              | Get all users          | Admin |
| GET    | `/api/v1/admin/getAllRide`              | Get all rides          | Admin |
| PATCH  | `/api/v1/admin/changeIsApproveStatus/:id` | Approve/suspend driver | Admin |
| PATCH  | `/api/v1/admin/updateActiveStatus/:id` | Active/Inactive driver | Admin |
| PATCH  | `/api/v1/admin/changeBlockStatus/:id` | Blocked/Unblocked driver | Admin |

---



