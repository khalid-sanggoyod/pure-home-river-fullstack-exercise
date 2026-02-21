# PURE Home River - Property Agent Management System

Senior Full Stack Engineer take-home exercise for PURE Home River.

A full-stack application for managing property agents with TypeScript REST API and Vue 3 client.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime |
| TypeScript | 5.2.2 | Type safety |
| Express | 4.18.2 | Web framework |
| Jest | 29.7.0 | Testing |
| express-rate-limit | 8.2.1 | API rate limiting |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Vue | 3.3.8 | UI framework |
| Pinia | 3.0.4 | State management |
| TypeScript | 5.2.2 | Type safety |
| Vite | 5.0.0 | Build tool |

---

## Prerequisites

- Node.js >= 20.x
- npm >= 10.x

---

## Project Structure

```
.
├── server/                 # Backend API
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── models/         # Data models
│       ├── repositories/   # Data access layer
│       ├── routes/         # API routes
│       ├── validators/     # Input validation
│       ├── middleware/     # Express middleware
│       └── __tests__/      # Unit tests
├── client/                 # Frontend Vue app
│   └── src/
│       ├── features/       # Feature modules
│       │   └── agents/     # Agent feature
│       │       ├── api/        # API calls
│       │       ├── components/ # Vue components
│       │       ├── composables/# Reusable logic
│       │       └── store/      # Pinia store
│       ├── composables/    # Shared composables
│       ├── constants/      # App constants
│       ├── services/       # HTTP client
│       └── types/          # TypeScript types
└── docs/                   # Documentation
    ├── data-model.md       # ERD and schema
    ├── api-examples.md     # curl examples
    └── pure-home-river-api.postman_collection.json  # Postman collection
```

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd pure-home-river-fullstack-exercise
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

Server runs at: `http://localhost:3000`

### Start the Frontend Client

```bash
cd client
npm run dev
```

Client runs at: `http://localhost:5173`

### Run Both (in separate terminals)

**Terminal 1 - Backend:**
```bash
cd server && npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client && npm run dev
```

---

## Available Scripts

### Server

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

### Client

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agents` | List all agents (with pagination & search) |
| GET | `/api/agents/:id` | Get single agent |
| POST | `/api/agents` | Create new agent |
| PUT | `/api/agents/:id` | Update agent |
| DELETE | `/api/agents/:id` | Delete agent |
| GET | `/api/health` | Health check |

### Query Parameters (GET /api/agents)

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name, email, or phone |
| `createdFrom` | date | Filter by creation date (from) |
| `createdTo` | date | Filter by creation date (to) |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

### Example curl Commands

**List all agents:**
```bash
curl http://localhost:3000/api/agents
```

**List with search & pagination:**
```bash
curl "http://localhost:3000/api/agents?search=john&page=1&limit=10"
```

**Get single agent:**
```bash
curl http://localhost:3000/api/agents/{id}
```

**Create agent:**
```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "mobileNumber": "+1-555-123-4567"
  }'
```

**Update agent:**
```bash
curl -X PUT http://localhost:3000/api/agents/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jonathan",
    "email": "jonathan.smith@example.com"
  }'
```

**Delete agent:**
```bash
curl -X DELETE http://localhost:3000/api/agents/{id}
```

See [docs/api-examples.md](docs/api-examples.md) for more detailed examples.

---

## Features

- CRUD operations for Property Agents
- Form validation (client & server)
- Search by name, email, or phone number
- Date range filtering
- Pagination
- Rate limiting (100 requests per 15 minutes)
- In-memory data storage
- 100% test coverage

---

## Stretch Goals Implemented

1. **Rate Limiting** - Prevents API abuse
2. **Pagination** - Configurable page size for large datasets
3. **Search & Filtering** - Full-text search and date filters
4. **Unit Tests** - Comprehensive test coverage
5. **Feature-based Architecture** - Scalable client structure with Pinia

---

## Documentation

- [Data Model & ERD](docs/data-model.md)
- [API Examples](docs/api-examples.md)
- [Postman Collection](docs/pure-home-river-api.postman_collection.json) - Import into Postman for API testing

---

## License

MIT
