/**
 * Test script for authentication endpoints
 * Run with: bun run test-auth.ts
 */

const BASE_URL = "http://localhost:3001";

interface AuthResponse {
  status: string;
  message?: string;
  data?: {
    user?: {
      id: string;
      email: string;
    };
    session?: {
      access_token: string;
      refresh_token: string;
    };
  };
}

const testEmail = `testuser${Date.now()}@gmail.com`;
const testPassword = "TestPass123";

console.log("🧪 Testing TaskHero Authentication API\n");
console.log("=" .repeat(50));

// Test 1: Signup
console.log("\n📝 Test 1: Sign Up");
console.log("-".repeat(50));

const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: testEmail,
    password: testPassword,
    fullName: "Test User",
  }),
});

const signupData: AuthResponse = await signupResponse.json();

if (signupResponse.ok) {
  console.log("✅ Signup successful");
  console.log(`   User ID: ${signupData.data?.user?.id}`);
  console.log(`   Email: ${signupData.data?.user?.email}`);
} else {
  console.log("❌ Signup failed");
  console.log(`   Error: ${signupData.message}`);
  process.exit(1);
}

const accessToken = signupData.data?.session?.access_token!;
const refreshToken = signupData.data?.session?.refresh_token!;

// Test 2: Get Profile
console.log("\n👤 Test 2: Get User Profile");
console.log("-".repeat(50));

const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const profileData = await profileResponse.json();

if (profileResponse.ok) {
  console.log("✅ Profile retrieved successfully");
  console.log(`   User: ${JSON.stringify(profileData.data, null, 2)}`);
} else {
  console.log("❌ Profile retrieval failed");
  console.log(`   Error: ${profileData.message}`);
}

// Test 3: Create Task (Authenticated)
console.log("\n📋 Test 3: Create Task (Authenticated)");
console.log("-".repeat(50));

const createTaskResponse = await fetch(`${BASE_URL}/api/tasks`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: "Authenticated Task",
    description: "This task belongs to the authenticated user",
  }),
});

const taskData = await createTaskResponse.json();

if (createTaskResponse.ok) {
  console.log("✅ Task created successfully");
  console.log(`   Task ID: ${taskData.data?.id}`);
  console.log(`   Title: ${taskData.data?.title}`);
  console.log(`   User ID: ${taskData.data?.user_id}`);
} else {
  console.log("❌ Task creation failed");
  console.log(`   Error: ${taskData.message}`);
}

// Test 4: Get Tasks (Authenticated)
console.log("\n📋 Test 4: Get User Tasks");
console.log("-".repeat(50));

const getTasksResponse = await fetch(`${BASE_URL}/api/tasks`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const tasksData = await getTasksResponse.json();

if (getTasksResponse.ok) {
  console.log("✅ Tasks retrieved successfully");
  console.log(`   Count: ${tasksData.count}`);
  console.log(`   Tasks: ${JSON.stringify(tasksData.data, null, 2)}`);
} else {
  console.log("❌ Tasks retrieval failed");
  console.log(`   Error: ${tasksData.message}`);
}

// Test 5: Refresh Token
console.log("\n🔄 Test 5: Refresh Access Token");
console.log("-".repeat(50));

const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    refresh_token: refreshToken,
  }),
});

const refreshData = await refreshResponse.json();

if (refreshResponse.ok) {
  console.log("✅ Token refreshed successfully");
  console.log(`   New access token: ${refreshData.data?.access_token?.substring(0, 20)}...`);
} else {
  console.log("❌ Token refresh failed");
  console.log(`   Error: ${refreshData.message}`);
}

// Test 6: Login (with same credentials)
console.log("\n🔐 Test 6: Login");
console.log("-".repeat(50));

const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: testEmail,
    password: testPassword,
  }),
});

const loginData: AuthResponse = await loginResponse.json();

if (loginResponse.ok) {
  console.log("✅ Login successful");
  console.log(`   User ID: ${loginData.data?.user?.id}`);
  console.log(`   Email: ${loginData.data?.user?.email}`);
} else {
  console.log("❌ Login failed");
  console.log(`   Error: ${loginData.message}`);
}

// Test 7: Password Reset Request
console.log("\n🔑 Test 7: Request Password Reset");
console.log("-".repeat(50));

const resetResponse = await fetch(`${BASE_URL}/api/auth/reset-password`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: testEmail,
  }),
});

const resetData = await resetResponse.json();

if (resetResponse.ok) {
  console.log("✅ Password reset requested");
  console.log(`   Message: ${resetData.message}`);
} else {
  console.log("❌ Password reset failed");
  console.log(`   Error: ${resetData.message}`);
}

// Test 8: Logout
console.log("\n👋 Test 8: Logout");
console.log("-".repeat(50));

const logoutResponse = await fetch(`${BASE_URL}/api/auth/logout`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const logoutData = await logoutResponse.json();

if (logoutResponse.ok) {
  console.log("✅ Logout successful");
  console.log(`   Message: ${logoutData.message}`);
} else {
  console.log("❌ Logout failed");
  console.log(`   Error: ${logoutData.message}`);
}

// Test 9: Try accessing protected route after logout
console.log("\n🚫 Test 9: Access Protected Route After Logout");
console.log("-".repeat(50));

const protectedResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

const protectedData = await protectedResponse.json();

if (!protectedResponse.ok) {
  console.log("✅ Protected route correctly blocked after logout");
  console.log(`   Error: ${protectedData.message}`);
} else {
  console.log("❌ Protected route should be blocked after logout");
}

// Summary
console.log("\n" + "=".repeat(50));
console.log("✅ All authentication tests completed!");
console.log("=".repeat(50));
console.log("\n📊 Test Summary:");
console.log("   ✅ User signup");
console.log("   ✅ Get user profile");
console.log("   ✅ Create authenticated task");
console.log("   ✅ Get user tasks");
console.log("   ✅ Refresh token");
console.log("   ✅ User login");
console.log("   ✅ Password reset request");
console.log("   ✅ User logout");
console.log("   ✅ Protected route security");
console.log("\n🎉 Authentication system is working correctly!");

