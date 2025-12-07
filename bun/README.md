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
│   │   ├── env.ts       # Environment variables
│   │   └── supabase.ts  # Supabase client
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   └── tasks.controller.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT authentication
│   │   ├── error-handler.ts
│   │   └── logger.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── index.ts
│   │   └── tasks.routes.ts
│   ├── types/           # TypeScript types
│   │   ├── database.types.ts
│   │   └── index.ts
│   ├── utils/           # Helper utilities
│   │   └── supabase.utils.ts
│   ├── validators/      # Request validation
│   │   ├── auth.validator.ts
│   │   └── task.validator.ts
│   └── index.ts         # Application entry point
├── supabase/
│   └── migrations/      # Database migrations
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 🛣️ API Endpoints

### Health Check

```
GET /health
```

### Authentication

```
POST   /api/auth/signup           # Create new user account
POST   /api/auth/login            # Login and get JWT tokens
POST   /api/auth/logout           # Logout (requires auth)
POST   /api/auth/reset-password   # Request password reset
POST   /api/auth/update-password  # Update password (requires auth)
POST   /api/auth/refresh          # Refresh access token
GET    /api/auth/profile          # Get user profile (requires auth)
```

See [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md) for detailed authentication documentation.

### Tasks

```
GET    /api/tasks       # Get all tasks (optional auth)
GET    /api/tasks/:id   # Get a single task (optional auth)
POST   /api/tasks       # Create a new task (optional auth)
PUT    /api/tasks/:id   # Update a task (optional auth)
DELETE /api/tasks/:id   # Delete a task (optional auth)
```

**Note:** Tasks API supports optional authentication. If authenticated, tasks are associated with the user.

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
- ✅ **User authentication (JWT)**
- ✅ **Login, signup, password reset**
- ✅ **Protected routes**
- ✅ **User-specific data isolation**

## 📝 Development Tips

- Use `bun run dev` for development with automatic reload
- All API routes are prefixed with `/api`
- Error handling is centralized in middleware
- Use `asyncHandler` wrapper for async route handlers
- Environment variables are validated on startup
- Authentication uses JWT tokens from Supabase
- See [AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md) for auth commands

## 📚 Documentation

- **[AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md)** - Complete authentication guide
- **[AUTH_QUICK_REFERENCE.md](./AUTH_QUICK_REFERENCE.md)** - Auth quick reference
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase setup instructions
- **[SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md)** - Supabase integration details
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick command reference

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request
