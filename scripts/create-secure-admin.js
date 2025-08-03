// Secure Admin Account Creation Script
// Creates a single admin account with strong security

function createSecureAdminAccount() {
  console.log("🔐 Creating secure admin account...")

  // Secure admin user data
  const adminUser = {
    id: "admin_secure_" + Date.now().toString(),
    email: "admin@nexus-secure.dev",
    password: "NX#Admin2024!SecureP@ss$", // Strong password - SAVE THIS!
    username: "NexusOwner",
    avatar: "N",
    role: "admin",
    rank: "pro",
    joinedAt: new Date().toISOString(),
    robuxBalance: 50000,
    bio: "Platform Owner & Administrator",
    location: "Secure Location",
    website: "",
    twitter: "",
    github: "",
    discord: "NexusOwner#0001",
  }

  // Get existing users
  const existingUsers = JSON.parse(localStorage.getItem("nexus_users") || "[]")

  // Check if this specific admin already exists
  const adminExists = existingUsers.find(
    (user) => user.email === adminUser.email || user.username === adminUser.username,
  )

  if (adminExists) {
    console.log("❌ This admin account already exists!")
    console.log("Username:", adminExists.username)
    console.log("Email:", adminExists.email)
    return false
  }

  // Add admin to users
  existingUsers.push(adminUser)
  localStorage.setItem("nexus_users", JSON.stringify(existingUsers))

  // Create user balances entry
  const userBalances = JSON.parse(localStorage.getItem("nexus_user_balances") || "{}")
  userBalances[adminUser.id] = adminUser.robuxBalance
  localStorage.setItem("nexus_user_balances", JSON.stringify(userBalances))

  console.log("✅ SECURE ADMIN ACCOUNT CREATED!")
  console.log("=".repeat(50))
  console.log("📧 EMAIL:", adminUser.email)
  console.log("🔑 PASSWORD:", adminUser.password)
  console.log("👤 USERNAME:", adminUser.username)
  console.log("=".repeat(50))
  console.log("🏆 RANK: PRO (Golden Crown)")
  console.log("⚡ ROLE: ADMIN (Full Control)")
  console.log("💰 ROBUX: 50,000 R$")
  console.log("=".repeat(50))
  console.log("")
  console.log("🚨 IMPORTANT SECURITY NOTES:")
  console.log("• SAVE THESE CREDENTIALS SECURELY")
  console.log("• DO NOT SHARE WITH ANYONE")
  console.log("• This is YOUR PERSONAL admin account")
  console.log("• You can manage all users, ranks, and platform")
  console.log("")
  console.log("🔗 Login URL: /auth/login")
  console.log("🛡️ Admin Panel: /admin (after login)")

  return true
}

// Execute the function
const success = createSecureAdminAccount()

if (success) {
  console.log("")
  console.log("🎯 ADMIN POWERS UNLOCKED:")
  console.log("• Promote users to Verified/PRO ranks")
  console.log("• Add Robux to any user account")
  console.log("• Approve/reject all scripts")
  console.log("• Manage platform executors")
  console.log("• Handle user reports")
  console.log("• Full administrative control")
}
