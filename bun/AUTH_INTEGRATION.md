# 🔐 Authentication Integration Complete!

Your TaskHero API now has full Supabase authentication with login, signup, and password reset!

## 📦 What's Been Added

### New Files Created:

1. **`src/controllers/auth.controller.ts`**

   - Complete authentication logic
   - Signup, login, logout, password reset, token refresh
   - User profile management

2. **`src/middleware/auth.ts`**

   - JWT token verification middleware
   - `requireAuth` - Protects routes requiring authentication
   - `optionalAuth` - Adds user to request if authenticated

3. **`src/routes/auth.routes.ts`**

   - All authentication endpoints
   - Properly secured with middleware

4. **`src/validators/auth.validator.ts`**
   - Request validation with Zod
   - Email format validation
   - Strong password requirements (8+ chars, uppercase, lowercase, number)

### Updated Files:

1. **`src/types/index.ts`** - Added auth types and Express Request extension
2. **`src/routes/index.ts`** - Added auth routes
3. **`src/routes/tasks.routes.ts`** - Added optional auth middleware
4. **`src/controllers/tasks.controller.ts`** - Tasks now associate with users

## 🚀 API Endpoints

### Authentication Endpoints

#### 1. **Sign Up** (Create New User)

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe" // optional
}
```

**Response (201):**

```json
{
  "status": "success",
  "message": "User created successfully",
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

#### 2. **Login** (Authenticate User)

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Login successful",
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

#### 3. **Logout**

```bash
POST /api/auth/logout
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Logout successful"
}
```

#### 4. **Request Password Reset**

```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

#### 5. **Update Password** (After Reset)

```bash
POST /api/auth/update-password
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "password": "NewSecurePass123"
}
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

#### 6. **Refresh Access Token**

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "expires_in": 3600,
    "expires_at": 1234567890
  }
}
```

#### 7. **Get User Profile**

```bash
GET /api/auth/profile
Authorization: Bearer {access_token}
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "user_metadata": {
      "full_name": "John Doe"
    }
  }
}
```

### Tasks Endpoints (Updated)

All task endpoints now support authentication! Tasks will be associated with the authenticated user.

**Without Authentication:**

- Tasks are created/accessed without `user_id` (backward compatible)

**With Authentication:**

- Include `Authorization: Bearer {access_token}` header
- Tasks are automatically associated with your user
- You can only see/modify your own tasks

```bash
# Example: Create task as authenticated user
POST /api/tasks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "My Task",
  "description": "Task description"
}
```

## 🔒 Security Features

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Token Security

- JWT tokens are validated on every request
- Tokens expire after 1 hour (configurable in Supabase)
- Refresh tokens can be used to get new access tokens
- Logout invalidates tokens server-side

### User Data Isolation

- Users can only access their own tasks
- Row Level Security (RLS) enforced by Supabase
- Proper authorization checks on all endpoints

## 📝 Using Authentication in Your App

### 1. Frontend Login Flow

```typescript
// Login
const response = await fetch("http://localhost:3001/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123",
  }),
});

const { data } = await response.json();
const { access_token, refresh_token } = data.session;

// Store tokens (localStorage, cookies, etc.)
localStorage.setItem("access_token", access_token);
localStorage.setItem("refresh_token", refresh_token);
```

### 2. Making Authenticated Requests

```typescript
const token = localStorage.getItem("access_token");

const response = await fetch("http://localhost:3001/api/tasks", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### 3. Handling Token Expiration

```typescript
async function refreshAccessToken() {
  const refresh_token = localStorage.getItem("refresh_token");

  const response = await fetch("http://localhost:3001/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  const { data } = await response.json();
  localStorage.setItem("access_token", data.access_token);

  return data.access_token;
}
```

### 4. Logout

```typescript
const token = localStorage.getItem("access_token");

await fetch("http://localhost:3001/api/auth/logout", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Clear stored tokens
localStorage.removeItem("access_token");
localStorage.removeItem("refresh_token");
```

## 🧪 Testing the Authentication

### 1. Sign Up a New User

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "fullName": "Test User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Save the `access_token` from the response!**

### 3. Create Task as Authenticated User

```bash
# Replace {TOKEN} with your access_token
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "title": "My Authenticated Task",
    "description": "This task belongs to me!"
  }'
```

### 4. Get Your Tasks

```bash
curl http://localhost:3001/api/tasks \
  -H "Authorization: Bearer {TOKEN}"
```

### 5. Get User Profile

```bash
curl http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer {TOKEN}"
```

### 6. Request Password Reset

```bash
curl -X POST http://localhost:3001/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

## ⚙️ Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Optional: Custom redirect URL for password reset emails
PASSWORD_RESET_URL=http://localhost:3001/auth/update-password
```

### Supabase Email Templates

To customize password reset emails:

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize "Reset Password" template
3. Set redirect URL to your frontend password reset page

## 🔧 Middleware Usage

### Require Authentication

Use `requireAuth` for protected routes:

```typescript
import { requireAuth } from "@/middleware/auth";

router.get("/protected", requireAuth, asyncHandler(handler));
```

### Optional Authentication

Use `optionalAuth` when auth is optional:

```typescript
import { optionalAuth } from "@/middleware/auth";

router.get("/public", optionalAuth, asyncHandler(handler));
// req.user will be present if authenticated, undefined otherwise
```

## 📊 Database Changes

Tasks table now properly uses `user_id`:

- Tasks with `user_id = NULL` are visible to unauthenticated users
- Tasks with `user_id` are only visible to that user
- Row Level Security (RLS) policies enforce this

## 🎯 Next Steps

### 1. Email Verification (Optional)

Currently auto-confirming emails for easier testing. To enable verification:

```typescript
// In auth.controller.ts, change:
email_confirm: false, // Requires email verification
```

### 2. Social Auth (Optional)

Add OAuth providers (Google, GitHub, etc.) via Supabase:

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
});
```

### 3. Multi-Factor Authentication (Optional)

Add MFA for enhanced security:

```typescript
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: "totp",
});
```

### 4. Session Management

Implement refresh token rotation, session limits, etc.

### 5. Rate Limiting

Add rate limiting to prevent abuse:

- Login attempts
- Password reset requests
- API calls

## 🆘 Troubleshooting

### "Invalid or expired token"

- Token might be expired (1 hour default)
- Use refresh token to get new access token
- Check token format: `Authorization: Bearer {token}`

### "User with this email already exists"

- User already registered
- Try login instead
- Or use different email

### "Invalid email or password"

- Check credentials are correct
- Email is case-sensitive
- Password requirements met

### "Row Level Security policy violation"

- Check that RLS policies are set up in Supabase
- Verify migration was run correctly
- Check user is authenticated for protected operations

### Password reset email not received

- Check Supabase email settings
- Verify email address is correct
- Check spam folder
- Ensure SMTP is configured in Supabase

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## 🎉 You're All Set!

Your API now has:

- ✅ User registration (signup)
- ✅ User authentication (login/logout)
- ✅ Password reset flow
- ✅ Token refresh mechanism
- ✅ User profile management
- ✅ Protected and public endpoints
- ✅ Task-user association
- ✅ Secure by default

**Start building your authenticated features! 🚀**

---

**Need help?** Check the troubleshooting section or Supabase documentation.
