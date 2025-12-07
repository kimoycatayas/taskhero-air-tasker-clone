# 🔑 Service Role Key Required for Password Reset

## ⚠️ Important: Add Service Role Key

To make password reset work, you need to add your **Supabase Service Role Key** to your `.env` file.

---

## 📝 How to Get Your Service Role Key

### Step 1: Go to Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your TaskHero project

### Step 2: Get the Service Role Key
1. Click **Settings** (gear icon) in the left sidebar
2. Click **API** section
3. Scroll down to find **Project API keys**
4. Copy the **`service_role`** key (⚠️ **secret** key - keep it private!)

---

## 🔧 Add to .env File

Add this line to your `bun/.env` file:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here...
```

### Complete .env Example:
```bash
PORT=3001
NODE_ENV=development
API_VERSION=v1

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (public key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (secret service role key)
```

---

## ⚠️ Security Warning

**IMPORTANT:** The service role key is **VERY POWERFUL** - it bypasses all Row Level Security (RLS) policies!

### Security Best Practices:

1. ✅ **NEVER** commit `.env` file to git (already in `.gitignore`)
2. ✅ **NEVER** expose this key in frontend code
3. ✅ **ONLY** use it in backend/server code
4. ✅ Store it securely (environment variables, secrets manager)
5. ✅ Rotate the key if it's ever exposed

---

## 🔄 Restart Backend After Adding Key

After adding the service role key to `.env`:

```bash
cd bun
# Stop the server (Ctrl+C if running)
bun run dev
```

---

## 🧪 Test Password Reset Again

Once you've added the service role key and restarted:

1. **Request password reset:**
   ```
   http://localhost:3000/forgot-password
   ```

2. **Check email for reset link**

3. **Click the link and update password**

4. **Should work now!** ✅

---

## 🎯 Why Service Role Key is Needed

### The Flow:
```
1. User clicks reset link with recovery token
       ↓
2. Backend verifies recovery token (proves user ownership)
       ↓
3. Backend uses SERVICE ROLE KEY to update password
       ↓
4. Password updated successfully
```

### Why Not Use Regular API?
- Recovery tokens are **temporary** and **limited**
- They can't directly update passwords via regular API
- Service role key allows admin operations **after** token verification
- It's secure because we verify the recovery token first

---

## ✅ Once Configured

After adding the service role key, password reset will work:

✅ User requests password reset  
✅ Email sent with recovery token  
✅ User clicks link  
✅ Backend verifies recovery token  
✅ Backend uses service role to update password  
✅ Password updated successfully!  

---

## 🔍 Checking if Key is Configured

The backend will now give you a clear error if the key is missing:

```json
{
  "status": "error",
  "message": "Service role key not configured. Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables."
}
```

---

## 📚 What Changed

The password reset flow now:

1. ✅ **Verifies recovery token** - Ensures request is legitimate
2. ✅ **Checks for service role key** - Clear error if missing
3. ✅ **Uses admin API** - Updates password with verified user ID
4. ✅ **Secure** - Token verified before any admin operations

---

**Add your service role key now and restart the backend!** 🚀

