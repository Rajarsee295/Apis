# APIS

A RESTful API built with **Node.js**, **Express**, **MongoDB**, and **AWS S3** that allows users to register, authenticate, and manage profile avatars with secure upload, validation, and moderation capabilities.

---

## 🛠️ Tech Stack

- Node.js + Express.js
- MongoDB 
- AWS S3 for image storage
- Bcrypt for password hashing 
- JWT for authentication
- Multer for file uploads
- Sharp for image processing
- Rate limiting for security

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Rajarsee295/Apis.git
```
### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a .env file in the root directory 
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_s3_region
AWS_BUCKET_NAME=your_bucket_name
```

### ▶️ Run the Server

```bash
npm start
```

The API will be running at http://localhost:5000.

---
