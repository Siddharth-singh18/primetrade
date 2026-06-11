# TaskFlow

![TaskFlow Header](https://via.placeholder.com/1200x400/0a0a0a/7c3aed?text=TaskFlow+-+Production+Grade+Task+Management)

TaskFlow is a highly scalable, production-grade full-stack task management application with role-based access control, caching, and a beautiful Next.js frontend. Built for a backend developer internship assignment.

## 🚀 Tech Stack

### Backend
- **Node.js & Express** - Core framework (TypeScript)
- **MongoDB & Mongoose** - Primary database
- **Redis** - Caching and token blacklisting
- **JWT** - Access and Refresh tokens
- **Zod** - Robust input validation
- **Swagger UI** - API documentation
- **Winston** - Structured logging

### Frontend
- **Next.js 14** - App Router (TypeScript)
- **Tailwind CSS** - Styling
- **Zustand** - Global state management
- **Axios** - HTTP requests with interceptors
- **Framer Motion** - Smooth animations

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Multi-stage Builds** - Optimized images

## 🛠️ Setup Instructions

### 1. Local Development Setup (Without Docker)

1. Ensure you have Node.js, MongoDB, and Redis installed and running.
2. Clone the repository.

**Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB and Redis URIs
npm run dev
```

**Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### 2. Docker Setup (Recommended)

Run the entire stack instantly with Docker Compose:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1
- **Swagger Docs**: http://localhost:5000/api-docs

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/taskflow |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `JWT_SECRET` | Secret for access tokens | your_secret |
| `JWT_REFRESH_SECRET`| Secret for refresh tokens | your_refresh_secret |
| `CORS_ORIGIN` | Allowed origin for frontend | http://localhost:3000 |

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| POST | `/api/v1/auth/refresh` | Get new access token | No (Uses Refresh Token) |
| POST | `/api/v1/auth/logout` | Logout (Blacklist token) | Yes |
| GET | `/api/v1/tasks` | Get all tasks for user | Yes |
| POST | `/api/v1/tasks` | Create a new task | Yes |
| PUT | `/api/v1/tasks/:id` | Update a task | Yes |
| DELETE | `/api/v1/tasks/:id` | Delete a task | Yes |
| GET | `/api/v1/admin/users` | Get all users | Yes (Admin only) |
| GET | `/api/v1/admin/tasks` | Get all tasks | Yes (Admin only) |
| PATCH | `/api/v1/admin/users/:id/role`| Update user role | Yes (Admin only) |

## 📈 Scalability Considerations

1. **Horizontal Scaling**: Stateless JWT authentication allows spinning up multiple backend instances behind a load balancer (e.g., Nginx, AWS ALB).
2. **Caching**: Redis is utilized to reduce database reads for frequent GET queries (e.g., fetching task lists). This can be extended to full query caching.
3. **Microservices architecture ready**: Authentication, tasks, and notifications can be easily extracted into separate microservices communicating via message queues (RabbitMQ/Kafka).
4. **Database Scaling**: MongoDB supports sharding and replica sets out-of-the-box for high availability.
5. **Rate Limiting**: IP-based rate limiting (100 req/15min) protects against abuse and DDoS attacks.
6. **Container Orchestration**: The provided Dockerfiles and Docker Compose setup make the application ready for Kubernetes (K8s) orchestration and auto-scaling.
