# 🚀 SkyView Capital – Backend API

Backend server for **SkyView Capital**, a full-stack web application that leverages AI to analyze and predict stock market trends.

---

## 📌 Overview

This backend powers the SkyView Capital platform by handling:

- 🔐 Secure user authentication (JWT)
- 👤 User management
- 📊 Data processing for stock analysis
- 🔗 Integration with frontend & AI models

Built using a scalable and production-ready architecture.

---

## ⚙️ Tech Stack

- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Authentication  
- Joi Validation  

---

## ✨ Key Features

- 🔐 JWT-based Login & Signup  
- 🛡️ Secure REST APIs  
- 📦 MVC architecture  
- ⚡ Scalable backend  
- 📄 Swagger API docs  
- 🚀 PM2 support  

---

## 📁 Project Structure
src/
├── config/ # Config & env setup
├── controllers/ # Route controllers
├── routes/ # API routes
├── models/ # DB schemas
├── services/ # Business logic
├── middlewares/ # Auth & validation
├── validations/ # Joi schemas
├── utils/ # Helpers
├── app.js # Express app
└── index.js # Entry point

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
2️⃣ Setup environment variables

Create .env file:

PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key

3️⃣ Run the server

Development:

npm run dev

Production:

npm start

🔑 API Endpoints
Authentication

POST /v1/auth/register → Register user

POST /v1/auth/login → Login user

POST /v1/auth/refresh-tokens → Refresh token

Users

GET /v1/users → Get all users

GET /v1/users/:id → Get user

PATCH /v1/users/:id → Update user

DELETE /v1/users/:id → Delete user

🔐 Authentication

All protected routes require:

Authorization: Bearer <your_token>
📄 API Docs

After running the server:

http://localhost:5000/v1/docs
⚠️ Common Issues
Port already in use
npx kill-port 5000
MongoDB not connecting

Check connection string

Ensure IP is whitelisted in MongoDB Atlas

👨‍💻 Author

Priyansh Shukla
📧 priyanshshukla84@gmail.com

🔗 https://www.linkedin.com/in/priyansh-shukla-95481523a/

🚀 Future Improvements

📊 Real-time stock API

📉 Advanced ML models

📧 Email verification

📈 Portfolio tracking

---

