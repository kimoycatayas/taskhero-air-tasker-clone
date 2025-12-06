# TaskHero API

Express + TypeScript API running on Bun runtime.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- A [Supabase](https://supabase.com) account and project

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the Supabase dashboard
3. Run the database migration (see `SUPABASE_SETUP.md` for detailed instructions)
4. Update your `.env` file with Supabase credentials

For detailed Supabase setup instructions, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

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

| Variable                  | Description                               | Required | Default     |
| ------------------------- | ----------------------------------------- | -------- | ----------- |
| PORT                      | Server port                               | No       | 3001        |
| NODE_ENV                  | Environment (development/production/test) | No       | development |
| API_VERSION               | API version                               | No       | v1          |
| SUPABASE_URL              | Supabase project URL                      | Yes      | -           |
| SUPABASE_ANON_KEY         | Supabase anonymous key                    | Yes      | -           |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key (admin)         | No       | -           |

## 📦 Tech Stack

- **Runtime**: Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
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
- ✅ Supabase integration
- ✅ PostgreSQL database
- ✅ Row Level Security (RLS)
- ✅ Auto-updating timestamps

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
