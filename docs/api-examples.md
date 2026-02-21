# PURE Home River API Examples

Base URL: `http://localhost:3000`

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable explanation"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `AGENT_NOT_FOUND` | 404 | Agent with given ID does not exist |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Agent CRUD Operations

### List All Agents

```bash
curl http://localhost:3000/api/agents
```

Response:
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@example.com",
        "mobileNumber": "+1-555-123-4567",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### List with Search & Pagination

```bash
curl "http://localhost:3000/api/agents?search=john&page=1&limit=10"
```

---

### Get Single Agent

```bash
curl http://localhost:3000/api/agents/550e8400-e29b-41d4-a716-446655440000
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "mobileNumber": "+1-555-123-4567",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

Error Response (404):
```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Property Agent with the given ID does not exist"
  }
}
```

---

### Create Agent

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "mobileNumber": "+1-555-987-6543"
  }'
```

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "mobileNumber": "+1-555-987-6543",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Property Agent successfully created"
}
```

Validation Error Response (400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email format is invalid"
  }
}
```

---

### Update Agent

```bash
curl -X PUT http://localhost:3000/api/agents/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "email": "jonathan.smith@example.com"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "Jonathan",
    "lastName": "Smith",
    "email": "jonathan.smith@example.com",
    "mobileNumber": "+1-555-123-4567",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Property Agent successfully updated"
}
```

Error Response (404):
```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Property Agent with the given ID does not exist"
  }
}
```

---

### Delete Agent

```bash
curl -X DELETE http://localhost:3000/api/agents/550e8400-e29b-41d4-a716-446655440000
```

Response (200):
```json
{
  "success": true,
  "data": null,
  "message": "Property Agent successfully deleted"
}
```

Error Response (404):
```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Property Agent with the given ID does not exist"
  }
}
```

---

## Validation Rules

| Field | Rules |
|-------|-------|
| firstName | Required, non-empty string |
| lastName | Required, non-empty string |
| email | Required, valid email format |
| mobileNumber | Required, valid phone format (7-15 digits) |

---

## Running the Server

```bash
cd server
npm install
npm run dev
```

Server will start on `http://localhost:3000`

---

## Running the Client

```bash
cd client
npm install
npm run dev
```

Client will start on `http://localhost:5173` with API proxy to the server.
