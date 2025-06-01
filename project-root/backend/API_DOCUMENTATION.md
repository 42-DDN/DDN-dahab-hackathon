# POS System API Documentation

## Base URL

```
http://localhost:3200/api
```

## Authentication

This API uses session-based authentication. After logging in, the session cookie will be automatically included in subsequent requests.

---

## Authentication Endpoints (`/api/auth`)

### 1. Welcome Message

- **URL:** `/api/auth/`
- **Method:** `GET`
- **Auth Required:** No
- **Description:** Welcome message for the authentication module

**Response:**

```json
{
  "message": "Welcome to the login dashboard"
}
```

### 2. User Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Description:** Authenticates a user (admin or seller) and creates a session

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (Admin):**

```json
{
  "message": "Login successful",
  "user": {
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Success Response (Seller):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "userId",
    "role": "seller"
  }
}
```

**Error Responses:**

- `404` - User not found
- `401` - Invalid credentials
- `403` - Access denied (not a seller when trying seller login)
- `500` - Internal server error

### 3. User Registration

- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Auth Required:** No
- **Description:** Creates a new user account

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "seller"
}
```

**Success Response:**

```json
{
  "message": "Signup successful",
  "user": {
    "id": "userId",
    "role": "seller"
  }
}
```

**Error Responses:**

- `400` - All fields are required
- `409` - User already exists
- `500` - Internal server error

### 4. User Logout

- **URL:** `/api/auth/logout`
- **Method:** `POST`
- **Auth Required:** Yes
- **Description:** Destroys the user session

**Success Response:**

```json
{
  "message": "Logout successful"
}
```

**Error Responses:**

- `401` - Unauthorized (not logged in)
- `500` - Logout failed

---

## Seller Endpoints (`/api/seller`)

### 1. Seller Dashboard

- **URL:** `/api/seller/`
- **Method:** `GET`
- **Auth Required:** No
- **Description:** Welcome message for the seller dashboard

**Response:**

```json
{
  "message": "Welcome to the seller dashboard"
}
```

### 2. Process Transaction

- **URL:** `/api/seller/transaction`
- **Method:** `POST`
- **Auth Required:** Yes (Session required)
- **Description:** Processes a gold transaction with multiple items

**Request Body:**

```json
{
  "itemIds": [
    "66f1a2b3c4d5e6f7a8b9c0d1",
    "66f1a2b3c4d5e6f7a8b9c0d2",
    "66f1a2b3c4d5e6f7a8b9c0d3"
  ],
  "paymentMethod": "cash",
  "tax": 15.5,
  "goldPrice": 65.5,
  "totalPrice": 1500.75
}
```

**Request Parameters:**

- `itemIds`: Array of item ObjectIds (required)
- `paymentMethod`: String (required) - Payment type (e.g., "cash", "card", "bank transfer")
- `tax`: Number (required) - Tax amount, must be >= 0
- `goldPrice`: Number (required) - Current gold price per gram, must be >= 0
- `totalPrice`: Number (optional) - Total transaction amount

**Success Response:**

```json
{
  "message": "Transaction successful",
  "itemIds": [
    "66f1a2b3c4d5e6f7a8b9c0d1",
    "66f1a2b3c4d5e6f7a8b9c0d2",
    "66f1a2b3c4d5e6f7a8b9c0d3"
  ],
  "paymentType": "cash",
  "tax": 15.5,
  "goldPrice": 65.5
}
```

**Error Responses:**

- `400` - Invalid or missing item IDs (must be non-empty array)
- `400` - Invalid or missing payment method
- `400` - Invalid or missing tax (must be number >= 0)
- `400` - Invalid or missing gold price (must be number >= 0)
- `401` - Unauthorized (session required)
- `404` - Item not found for one of the provided IDs
- `404` - Worker not found (session user not found)
- `500` - Internal server error

---

## Management Endpoints (`/api/management`)

### 1. Management Dashboard

- **URL:** `/api/management/`
- **Method:** `GET`
- **Auth Required:** No
- **Description:** Welcome message for the management dashboard

**Response:**

```json
{
  "message": "Welcome to the management dashboard"
}
```

### 2. Get Single Item

- **URL:** `/api/management/getitem`
- **Method:** `POST`
- **Auth Required:** Yes
- **Description:** Retrieves a specific item by ID

**Request Body:**

```json
{
  "itemId": "66f1a2b3c4d5e6f7a8b9c0d1"
}
```

**Success Response:**

```json
{
  "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
  "type": "Ring",
  "karat": "24k",
  "weight": 10.5,
  "origin": "Dubai",
  "buyPrice": 500,
  "manufacturePrice": 600,
  "sellerInfo": "66f1a2b3c4d5e6f7a8b9c0d2"
}
```

**Error Responses:**

- `400` - Item ID is required
- `401` - Unauthorized access. Please log in
- `404` - Item not found
- `500` - Internal server error

### 3. Create New Item

- **URL:** `/api/management/newitem`
- **Method:** `POST`
- **Auth Required:** Yes
- **Description:** Creates a new gold item in the inventory

**Request Body:**

```json
{
  "type": "Ring",
  "karat": "24k",
  "weight": 10.5,
  "origin": "Dubai",
  "buyPrice": 500,
  "manufacturePrice": 600
}
```

**Success Response:**

```json
{
  "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
  "type": "Ring",
  "karat": "24k",
  "weight": 10.5,
  "origin": "Dubai",
  "buyPrice": 500,
  "manufacturePrice": 600,
  "sellerInfo": "66f1a2b3c4d5e6f7a8b9c0d2"
}
```

**Validation Rules:**

- `type`: Required string
- `karat`: Required, must be one of ["24k", "21k", "18k", "14k"]
- `weight`: Required number
- `origin`: Required string
- `buyPrice`: Required number
- `manufacturePrice`: Required number

**Error Responses:**

- `400` - All fields are required
- `401` - Unauthorized access. Please log in
- `500` - Internal server error

### 4. Get All Items

- **URL:** `/api/management/getallitems`
- **Method:** `GET`
- **Auth Required:** Yes
- **Description:** Retrieves all items with seller information populated

**Success Response:**

```json
[
  {
    "_id": "66f1a2b3c4d5e6f7a8b9c0d1",
    "type": "Ring",
    "karat": "24k",
    "weight": 10.5,
    "origin": "Dubai",
    "buyPrice": 500,
    "manufacturePrice": 600,
    "sellerInfo": {
      "_id": "66f1a2b3c4d5e6f7a8b9c0d2",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

**Error Responses:**

- `401` - Unauthorized access. Please log in
- `500` - Internal server error

---

## Data Models

### Item Schema

```json
{
  "_id": "ObjectId",
  "type": "String (required)",
  "karat": "String (required, enum: ['24k', '21k', '18k', '14k'])",
  "weight": "Number (required)",
  "origin": "String (required)",
  "buyPrice": "Number (required)",
  "manufacturePrice": "Number (required)",
  "sellerInfo": "ObjectId (ref: Worker, required)"
}
```

### Worker Schema

```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required)",
  "role": "String (enum: ['admin', 'seller'], default: 'seller')",
  "createdAt": "Date (default: now)",
  "transactions": ["ObjectId (ref: Transaction)"]
}
```

### Transaction Schema

```json
{
  "_id": "ObjectId",
  "soldItems": ["ObjectId (ref: Item, required)"],
  "paymentType": "String (required)",
  "tax": "Number (required, min: 0)",
  "goldPrice": "Number (required, min: 0)",
  "totalPrice": "Number",
  "createdAt": "Date (default: now)",
  "updatedAt": "Date (default: now)"
}
```

---

## Error Codes

| Code | Description                            |
| ---- | -------------------------------------- |
| 200  | Success                                |
| 201  | Created                                |
| 400  | Bad Request - Invalid input data       |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions   |
| 404  | Not Found - Resource doesn't exist     |
| 409  | Conflict - Resource already exists     |
| 500  | Internal Server Error                  |

---

## Session Management

The API uses express-session with MongoDB store. Sessions are stored in the database and expire after 24 hours.

**Session Data Structure:**

```json
{
  "user": {
    "id": "userId",
    "email": "user@example.com",
    "role": "seller" | "admin"
  }
}
```

**Admin Credentials:**

- Email: `admin@example.com`
- Password: Environment variable `ADMIN_PASSWORD`

---

## Example Usage

### Login as Admin

```bash
curl -X POST http://localhost:3200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "forgodsake"
  }'
```

### Create New Item

```bash
curl -X POST http://localhost:3200/api/management/newitem \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{
    "type": "Necklace",
    "karat": "21k",
    "weight": 15.2,
    "origin": "Egypt",
    "buyPrice": 800,
    "manufacturePrice": 950
  }'
```

### Get All Items

```bash
curl -X GET http://localhost:3200/api/management/getallitems \
  -H "Cookie: connect.sid=your-session-cookie"
```

### Process Transaction

```bash
curl -X POST http://localhost:3200/api/seller/transaction \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{
    "itemIds": [
      "66f1a2b3c4d5e6f7a8b9c0d1",
      "66f1a2b3c4d5e6f7a8b9c0d2"
    ],
    "paymentMethod": "cash",
    "tax": 15.5,
    "goldPrice": 65.50,
    "totalPrice": 1500.75
  }'
```
