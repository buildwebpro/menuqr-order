import { db, users } from "./src/db/index";
import bcrypt from "bcryptjs";

const email = "admin@menuqr.com";
const password = "Admin@123456";
const name = "Admin";

const passwordHash = await bcrypt.hash(password, 10);

await db.insert(users).values({
  email,
  passwordHash,
  name,
});

console.log("Admin account created:");
console.log("  Email:", email);
console.log("  Password:", password);
