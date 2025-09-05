# Digital Wallet System Backend (bKash/Nagad-like)

## 📌 Overview

This is a **digital wallet system** built with **Node.js, Express, TypeScript, and MongoDB**. It simulates features similar to **bKash/Nagad**, supporting multiple roles: **SUPER_ADMIN,Admin, Agent, and User**. The system handles secure payments, wallet management, and transaction tracking.

---

## 📂 Project Structure

```
src
│   app.ts               # Application entry
│   server.ts            # Server bootstrap
│
└───app
    ├───config
    │       env.ts               # Environment config
    │
    ├───errorHelpers
    │       AppError.ts          # Custom error handler
    │
    ├───interfaces
    │       index.d.ts           # Shared type definitions
    │
    ├───middlewire
    │       checkAuth.ts         # JWT auth middleware
    │       globalErrorHandler.ts# Global error handler
    │       notFound.ts          # 404 handler
    │
    ├───modules
    │   ├───auth
    │   │       auth.controller.ts
    │   │       auth.routes.ts
    │   │       auth.services.ts
    │   │
    │   ├───payment
    │   │       payment.controller.ts
    │   │       payment.interface.ts
    │   │       payment.model.ts
    │   │       payment.routes.ts
    │   │       payment.services.ts
    │   │
    │   ├───transaction
    │   │       transaction.controller.ts
    │   │       transaction.model.ts
    │   │       transaction.routes.ts
    │   │       transaction.services.ts
    │   │       transcation.interface.ts
    │   │
    │   ├───user
    │   │       user.interface.ts
    │   │       user.model.ts
    │   │       user.service.ts
    │   │       user.validation.ts
    │   │       users.controller.ts
    │   │       users.routes.ts
    │   │
    │   └───wallet
    │           wallet.interface.ts
    │           wallet.model.ts
    │
    ├───routes
    │       index.ts              # Centralized routes export
    │
    ├───sslCommerz
    │       sslCommerz.interface.ts
    │       sslCommerz.service.ts
    │
    └───utils
            catchAsync.ts
            jwt.ts
            seedSuperAdmin.ts
            sendResponse.ts
            userToken.ts
            validateRequest.ts
```

---

## 🚀 Features

* ✅ JWT-based authentication system with **Admin**, **Agent**, and **User** roles
* ✅ Secure password hashing (bcrypt)
* ✅ Automatic wallet creation at registration (default balance: **৳50**)
* ✅ **User capabilities**:

  * Add money (from agent)
  * Withdraw money(from agent)
  * Send money to another user
  * View transaction history
* ✅ **Agent capabilities**:

  * Add money to any user's wallet (Cash-in)
  * Withdraw money from any user's wallet (Cash-out)
  * View commission history 
* ✅ **Admin capabilities**:

  * View all users, agents, wallets, and transactions
  * Block/unblock user wallets
  * Approve/suspend agents
  * Set system parameters (transaction fees, etc.)
* ✅ Role-based route protection
* ✅ All transactions stored and fully trackable

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express, TypeScript
* **Database**: MongoDB with Mongoose
* **Authentication**: JWT
* **Payment Gateway**: SSLCommerz
* **Other**: bcrypt, dotenv, axios

---

## ⚙️ Setup & Installation

1. Clone the repo:

   ```bash
   git clone <repo-url>
   cd digital-wallet
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file with required configs (DB, JWT, SSLCommerz keys,bcrypt etc.)
4. Run the server:

   ```bash
   npm run dev
   ```

---

## 🔐 Roles & Permissions

* **Admin** → Full access to system management
* **Agent** → Can handle cash-in/cash-out, commissions
* **User** → Personal wallet management

---

## 📚 API Endpoints

* `/api/v1/auth` → Authentication routes (login, reset password)
* `/api/v1/user` → User-related actions
* `create automatically when user created` → Wallet management
* `/api/v1/payment` → Payment processing (SSLCommerz)
* `/api/v1/transaction` → Transactions history

## Video Demonstration
https://drive.google.com/file/d/1aGUfXK5WqENg2CtHeYC4arCEj0jnRz90/view   


https://drive.google.com/file/d/1767bcPyVmzprtDCte_8-0FcO7NXRugt1/view

