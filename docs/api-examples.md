# PURE Home River API Examples

Base URL: `http://localhost:3000`

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
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "mobileNumber": "+1-555-123-4567",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### Get Single Agent

```bash
curl http://localhost:3000/api/agents/550e8400-e29b-41d4-a716-446655440000
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "mobileNumber": "+1-555-123-4567",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

Error Response (404):
```json
{
  "error": "Agent not found"
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
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "mobileNumber": "+1-555-987-6543",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

Validation Error Response (400):
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    },
    {
      "field": "mobileNumber",
      "message": "Mobile number must be a valid phone number (7-15 digits)"
    }
  ]
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
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "Jonathan",
  "lastName": "Smith",
  "email": "jonathan.smith@example.com",
  "mobileNumber": "+1-555-123-4567",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

Error Response (404):
```json
{
  "error": "Agent not found"
}
```

---

### Delete Agent

```bash
curl -X DELETE http://localhost:3000/api/agents/550e8400-e29b-41d4-a716-446655440000
```

Response: `204 No Content` (empty body)

Error Response (404):
```json
{
  "error": "Agent not found"
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
