#!/usr/bin/env bun

/**
 * Interactive setup script for TaskHero API
 * Run with: bun run setup.ts
 */

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function setup() {
  console.log(`\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   TaskHero API - Setup Wizard         ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`);

  console.log(`${colors.cyan}This wizard will help you set up your environment variables.${colors.reset}\n`);

  // Port
  const port = await question(`${colors.green}Server Port${colors.reset} (default: 3001): `);

  // Environment
  const nodeEnv = await question(
    `${colors.green}Environment${colors.reset} (development/production/test, default: development): `
  );

  // Supabase URL
  console.log(`\n${colors.yellow}📊 Supabase Configuration${colors.reset}`);
  console.log(`${colors.cyan}Get these from: https://app.supabase.com/project/_/settings/api${colors.reset}\n`);

  const supabaseUrl = await question(
    `${colors.green}Supabase Project URL${colors.reset} (https://xxxxx.supabase.co): `
  );

  const supabaseAnonKey = await question(
    `${colors.green}Supabase Anon Key${colors.reset} (eyJhbGc...): `
  );

  const includeServiceKey = await question(
    `${colors.green}Include Service Role Key?${colors.reset} (y/n, default: n): `
  );

  let supabaseServiceKey = "";
  if (includeServiceKey.toLowerCase() === "y" || includeServiceKey.toLowerCase() === "yes") {
    supabaseServiceKey = await question(
      `${colors.green}Supabase Service Role Key${colors.reset} (eyJhbGc...): `
    );
  }

  // Create .env file
  const envContent = `# Server Configuration
PORT=${port || "3001"}
NODE_ENV=${nodeEnv || "development"}

# API Configuration
API_VERSION=v1

# Supabase Configuration
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
${supabaseServiceKey ? `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}` : "# SUPABASE_SERVICE_ROLE_KEY="}
`;

  const envPath = path.join(__dirname, ".env");

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question(
      `\n${colors.yellow}⚠️  .env file already exists. Overwrite?${colors.reset} (y/n): `
    );
    if (overwrite.toLowerCase() !== "y" && overwrite.toLowerCase() !== "yes") {
      console.log(`\n${colors.yellow}Setup cancelled. Your existing .env file was not modified.${colors.reset}\n`);
      rl.close();
      return;
    }
  }

  // Write .env file
  fs.writeFileSync(envPath, envContent);

  console.log(`\n${colors.green}✅ .env file created successfully!${colors.reset}\n`);
  console.log(`${colors.cyan}Next steps:${colors.reset}`);
  console.log(`  1. Run the database migration (see SUPABASE_SETUP.md)`);
  console.log(`  2. Start the development server: ${colors.blue}bun run dev${colors.reset}`);
  console.log(`  3. Test the API: ${colors.blue}bun run test:api${colors.reset}\n`);

  rl.close();
}

setup().catch(console.error);

