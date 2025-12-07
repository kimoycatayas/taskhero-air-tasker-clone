# 🔐 Auth Quick Reference

## 📋 Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | No | Create new user account |
| POST | `/api/auth/login` | No | Login and get tokens |
| POST | `/api/auth/logout` | Yes | Logout and invalidate token |
| POST | `/api/auth/reset-password` | No | Request password reset email |
| POST | `/api/auth/update-password` | Yes | Update password |
| POST | `/api/auth/refresh` | No | Refresh access token |
| GET | `/api/auth/profile` | Yes | Get current user info |

## 🔑 Quick Commands

### Sign Up
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123","fullName":"John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123"}'
```

### Get Profile
```bash
curl http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer {YOUR_TOKEN}"
```

### Create Task (Authenticated)
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {YOUR_TOKEN}" \
  -d '{"title":"My Task","description":"Details"}'
```

### Reset Password
```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

## 🔒 Password Requirements

- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)

Examples:
- ✅ `SecurePass123`
- ✅ `MyPassword1`
- ❌ `password` (no uppercase, no number)
- ❌ `Pass1` (too short)

## 🛡️ Using Auth in Code

### Protect a Route
```typescript
import { requireAuth } from "@/middleware/auth";

router.get("/protected", requireAuth, asyncHandler(handler));
```

### Optional Auth
```typescript
import { optionalAuth } from "@/middleware/auth";

router.get("/public", optionalAuth, asyncHandler(handler));
// req.user exists if authenticated
```

### Access User in Controller
```typescript
export const myHandler = async (req: Request, res: Response) => {
  const userId = req.user?.id; // User ID if authenticated
  const userEmail = req.user?.email; // User email
  
  // Your logic here
};
```

## 📦 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Auth Response (Login/Signup)
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc...",
      "expires_in": 3600,
      "expires_at": 1234567890
    }
  }
}
```

## 🔄 Token Flow

1. **Login** → Get `access_token` and `refresh_token`
2. **Use** → Include `Authorization: Bearer {access_token}` in requests
3. **Expire** → Access token expires after 1 hour
4. **Refresh** → Use `refresh_token` to get new `access_token`
5. **Logout** → Invalidate tokens

## 🧪 Testing Workflow

```bash
# 1. Sign up
RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}')

# 2. Extract token (requires jq)
TOKEN=$(echo $RESPONSE | jq -r '.data.session.access_token')

# 3. Use token
curl http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## 🚨 Common Errors

| Status | Error | Cause |
|--------|-------|-------|
| 400 | Invalid email format | Email validation failed |
| 400 | Password requirements not met | Weak password |
| 401 | Invalid email or password | Wrong credentials |
| 401 | Invalid or expired token | Token expired/invalid |
| 409 | User already exists | Email already registered |

## 📝 Environment Variables

```bash
# Required
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Optional but recommended

# Optional
PASSWORD_RESET_URL=http://localhost:3001/auth/update-password
```

## 🔗 Related Files

- **Controllers**: `src/controllers/auth.controller.ts`
- **Middleware**: `src/middleware/auth.ts`
- **Routes**: `src/routes/auth.routes.ts`
- **Validators**: `src/validators/auth.validator.ts`
- **Types**: `src/types/index.ts`

## 📚 Full Documentation

See [AUTH_INTEGRATION.md](./AUTH_INTEGRATION.md) for complete documentation.

---

**Quick Start:**
1. Sign up: `POST /api/auth/signup`
2. Login: `POST /api/auth/login`
3. Save token from response
4. Use token: `Authorization: Bearer {token}`
5. Build features! 🚀

