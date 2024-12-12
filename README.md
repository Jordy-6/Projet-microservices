# Microservices Example Project

## Description

This project demonstrates a simple microservices architecture with the following services:

- **Auth Service**: Manages user authentication and issues JWT tokens.
- **Users Service**: Manages user data (CRUD operations).
- **Orders Service**: Manages orders placed by users.
- **Products Service**: Manages product data.
- **API Gateway**: A single entry point for clients, routing requests to appropriate services and handling JWT validation.

---

## Features

- Decoupled services communicating via REST APIs.
- JWT-based authentication for secure access.
- Centralized API Gateway for routing and security.
- Swagger documentation for each service.

---

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [ngrok](https://ngrok.com/) (optional for external exposure)

---

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd microservices-example
   ```

2. **Install dependencies globally:**
   Install all dependencies for the entire project in one step:

   ```bash
   npm install
   ```

---

## Running the Services

Start each service individually in separate terminals. By default, the services run on the following ports:

- **Auth Service**: `http://localhost:3004`
- **Users Service**: `http://localhost:3001`
- **Orders Service**: `http://localhost:3002`
- **Products Service**: `http://localhost:3003`
- **API Gateway**: `http://localhost:3000`

### Commands to start the services:

1. **Auth Service:**

   ```bash
   cd auth
   node server.js
   ```

2. **Users Service:**

   ```bash
   cd users
   node server.js
   ```

3. **Orders Service:**

   ```bash
   cd orders
   node server.js
   ```

4. **Products Service:**

   ```bash
   cd products
   node server.js
   ```

5. **API Gateway:**

   ```bash
   cd api-gateway
   node server.js
   ```

---

## Accessing the Services

### **API Gateway**

Access all services via the API Gateway at `http://localhost:3000`.

Example Routes:

- Login: `POST http://localhost:3000/login`
- Get Users: `GET http://localhost:3000/users`
- Create Order: `POST http://localhost:3000/orders`
- Get Products: `GET http://localhost:3000/products`

### **Swagger Documentation**

Each service has its own Swagger documentation accessible at the following URLs:

- Auth: `http://localhost:3004/api-docs`
- Users: `http://localhost:3001/api-docs`
- Orders: `http://localhost:3002/api-docs`
- Products: `http://localhost:3003/api-docs`

---

## Workflow Example

1. **Authenticate:**

   - Send a `POST` request to `http://localhost:3000/login` with the following body:
     ```json
     {
       "username": "Alice",
       "password": "password1"
     }
     ```
   - Copy the `token` from the response.

2. **Access Secured Endpoints:**

   - Use the token in the `Authorization` header for subsequent requests:
     ```
     Authorization: Bearer <your_token>
     ```
   - Example: `GET http://localhost:3000/users`

