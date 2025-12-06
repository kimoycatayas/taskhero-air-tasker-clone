#!/usr/bin/env bun

/**
 * Simple API test script
 * Run with: bun run test-api.ts
 */

const API_BASE = "http://localhost:3001";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

async function testEndpoint(
  name: string,
  method: string,
  url: string,
  body?: any
) {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      console.log(
        `${colors.green}✓${colors.reset} ${name} - Status: ${response.status}`
      );
      console.log(`  Response:`, data);
    } else {
      console.log(
        `${colors.red}✗${colors.reset} ${name} - Status: ${response.status}`
      );
      console.log(`  Error:`, data);
    }
    console.log("");
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name} - Failed to connect`);
    console.log(`  Error:`, error);
    console.log("");
  }
}

async function runTests() {
  console.log(`${colors.blue}🧪 Running API Tests${colors.reset}\n`);

  // Health check
  await testEndpoint("Health Check", "GET", `${API_BASE}/health`);

  // Get all tasks
  await testEndpoint("Get All Tasks", "GET", `${API_BASE}/api/tasks`);

  // Create a task
  await testEndpoint("Create Task", "POST", `${API_BASE}/api/tasks`, {
    title: "Test Task from Script",
    description: "Testing the API",
  });

  // Create task without title (should fail)
  await testEndpoint(
    "Create Task (Invalid - No Title)",
    "POST",
    `${API_BASE}/api/tasks`,
    {
      description: "This should fail",
    }
  );

  // Get specific task
  await testEndpoint("Get Task by ID", "GET", `${API_BASE}/api/tasks/1`);

  // Update task
  await testEndpoint("Update Task", "PUT", `${API_BASE}/api/tasks/1`, {
    status: "completed",
  });

  // Get non-existent task (should fail)
  await testEndpoint("Get Non-existent Task", "GET", `${API_BASE}/api/tasks/999`);

  console.log(`${colors.blue}✨ Tests Complete${colors.reset}`);
}

runTests();

