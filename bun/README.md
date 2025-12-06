# TaskHero API

Express + TypeScript API running on Bun runtime.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Run in development mode with hot reload
bun run dev

# Run in production mode
bun start
```

### Build

```bash
# Build the project
bun run build

# Run the built version
bun run prod
```

## 📁 Project Structure

```
bun/
├── src/
│   ├── config/          # Configuration files
│   │   └── env.ts       # Environment variables
│   ├── controllers/     # Request handlers
│   │   └── tasks.controller.ts
│   ├── middleware/      # Express middleware
│   │   ├── error-handler.ts
│   │   └── logger.ts
│   ├── routes/          # API routes
│   │   ├── index.ts
│   │   └── tasks.routes.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── index.ts         # Application entry point
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 🛣️ API Endpoints

### Health Check

```
GET /health
```

### Tasks

```
GET    /api/tasks       # Get all tasks
GET    /api/tasks/:id   # Get a single task
POST   /api/tasks       # Create a new task
PUT    /api/tasks/:id   # Update a task
DELETE /api/tasks/:id   # Delete a task
```

## 🔧 Environment Variables

| Variable    | Description                               | Default     |
| ----------- | ----------------------------------------- | ----------- |
| PORT        | Server port                               | 3001        |
| NODE_ENV    | Environment (development/production/test) | development |
| API_VERSION | API version                               | v1          |

## 📦 Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **CORS**: cors middleware

## 🎯 Features

- ✅ TypeScript support
- ✅ Express.js framework
- ✅ Hot reload in development
- ✅ Error handling middleware
- ✅ Request logging
- ✅ Environment variable validation
- ✅ CORS enabled
- ✅ RESTful API structure
- ✅ Type-safe responses

## 📝 Development Tips

- Use `bun run dev` for development with automatic reload
- All API routes are prefixed with `/api`
- Error handling is centralized in middleware
- Use `asyncHandler` wrapper for async route handlers
- Environment variables are validated on startup

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request
