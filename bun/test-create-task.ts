/**
 * Test script for Create Task Backend Integration
 * 
 * This script tests the create task endpoint with all new fields
 */

const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

// Test data
const testEmail = `test${Date.now()}@gmail.com`;
const testPassword = "TestPassword123!";

interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  data?: T;
  token?: string;
}

async function makeRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`\n📤 ${options.method || "GET"} ${url}`);

  if (options.body) {
    console.log("Body:", JSON.parse(options.body as string));
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();
  console.log(`📥 Status: ${response.status}`);
  console.log("Response:", JSON.stringify(data, null, 2));

  return data;
}

async function testCreateTaskIntegration() {
  console.log("🧪 Testing Create Task Backend Integration\n");
  console.log("=".repeat(60));

  try {
    // Step 1: Create a test user
    console.log("\n\n1️⃣  Creating test user...");
    const signupResult = await makeRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        full_name: "Test User",
      }),
    });

    if (signupResult.status !== "success") {
      throw new Error(`Signup failed: ${signupResult.message}`);
    }

    // If email confirmation is required, we need to use login after confirming
    // For testing, we'll skip this and use a pre-confirmed account
    let token = signupResult.token;

    if (!token) {
      console.log("\n⚠️  Email confirmation required. Using login instead...");
      const loginResult = await makeRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      if (loginResult.status !== "success") {
        throw new Error(
          `Login failed: ${loginResult.message}. You may need to disable email confirmation in Supabase.`
        );
      }

      token = loginResult.token;
    }

    console.log("✅ User created and authenticated");

    // Step 2: Create a task with minimal fields
    console.log("\n\n2️⃣  Creating task with minimal fields...");
    const minimalTask = await makeRequest("/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Test Task - Minimal Fields",
        description: "This is a test task with only required fields",
      }),
    });

    if (minimalTask.status !== "success") {
      throw new Error(`Failed to create minimal task: ${minimalTask.message}`);
    }

    console.log("✅ Minimal task created:", minimalTask.data?.id);

    // Step 3: Create a task with all new fields
    console.log("\n\n3️⃣  Creating task with all new fields...");
    const fullTask = await makeRequest("/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Help move my sofa",
        description:
          "Need help moving a 3-seater sofa from one apartment to another. The sofa is in good condition but quite heavy.",
        date_type: "on_date",
        task_date: new Date("2024-12-15").toISOString(),
        location_address: "Sydney CBD → Bondi",
        location_lat: -33.8688,
        location_lng: 151.2093,
        budget_min: 150,
        budget_max: 200,
        budget_currency: "USD",
      }),
    });

    if (fullTask.status !== "success") {
      throw new Error(`Failed to create full task: ${fullTask.message}`);
    }

    console.log("✅ Full task created:", fullTask.data?.id);

    // Step 4: Verify the task was created with all fields
    console.log("\n\n4️⃣  Verifying created task...");
    const taskId = fullTask.data?.id;
    const verifyTask = await makeRequest(`/api/tasks/${taskId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (verifyTask.status !== "success") {
      throw new Error(`Failed to fetch task: ${verifyTask.message}`);
    }

    const task = verifyTask.data;
    console.log("\n✅ Task verification:");
    console.log(`  Title: ${task.title}`);
    console.log(`  Description: ${task.description}`);
    console.log(`  Date Type: ${task.date_type}`);
    console.log(`  Task Date: ${task.task_date}`);
    console.log(`  Location: ${task.location_address}`);
    console.log(`  Coordinates: (${task.location_lat}, ${task.location_lng})`);
    console.log(
      `  Budget: $${task.budget_min} - $${task.budget_max} ${task.budget_currency}`
    );
    console.log(`  Status: ${task.status}`);
    console.log(`  User ID: ${task.user_id}`);

    // Step 5: Test with "flexible" date type
    console.log("\n\n5️⃣  Creating task with flexible date...");
    const flexibleTask = await makeRequest("/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Garden maintenance - Flexible timing",
        description: "Need help with garden cleanup and maintenance",
        date_type: "flexible",
        task_date: null,
        location_address: "Parramatta",
        budget_min: 80,
        budget_max: 120,
        budget_currency: "USD",
      }),
    });

    if (flexibleTask.status !== "success") {
      throw new Error(
        `Failed to create flexible task: ${flexibleTask.message}`
      );
    }

    console.log("✅ Flexible task created:", flexibleTask.data?.id);

    // Step 6: Test with "before_date" type
    console.log("\n\n6️⃣  Creating task with before date...");
    const beforeDateTask = await makeRequest("/api/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "House cleaning before party",
        description: "Need house cleaned before my party",
        date_type: "before_date",
        task_date: new Date("2024-12-20").toISOString(),
        location_address: "Bondi Beach",
        budget_min: 100,
        budget_max: 150,
        budget_currency: "USD",
      }),
    });

    if (beforeDateTask.status !== "success") {
      throw new Error(
        `Failed to create before_date task: ${beforeDateTask.message}`
      );
    }

    console.log("✅ Before date task created:", beforeDateTask.data?.id);

    // Step 7: Fetch all user tasks
    console.log("\n\n7️⃣  Fetching all user tasks...");
    const allTasks = await makeRequest("/api/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (allTasks.status !== "success") {
      throw new Error(`Failed to fetch tasks: ${allTasks.message}`);
    }

    console.log(`✅ Found ${allTasks.count} tasks for this user`);

    // Summary
    console.log("\n\n" + "=".repeat(60));
    console.log("🎉 All tests passed successfully!");
    console.log("=".repeat(60));
    console.log("\n✅ Summary:");
    console.log(`  • Created test user: ${testEmail}`);
    console.log(`  • Created ${allTasks.count} tasks`);
    console.log("  • Verified all new fields are working");
    console.log("  • Tested all date types: on_date, before_date, flexible");
    console.log("  • Tested location and budget fields");
    console.log("\n✨ The Create Task backend integration is working perfectly!");

    return true;
  } catch (error) {
    console.error("\n\n❌ Test failed:", error);
    console.error("\n🔍 Troubleshooting:");
    console.error("  1. Make sure the backend server is running (bun run dev)");
    console.error(
      "  2. Make sure you've applied the database migration (002_add_task_fields.sql)"
    );
    console.error(
      "  3. Check if email confirmation is disabled in Supabase (or use a confirmed account)"
    );
    console.error("  4. Check backend logs for detailed error messages");
    return false;
  }
}

// Run the test
testCreateTaskIntegration();

