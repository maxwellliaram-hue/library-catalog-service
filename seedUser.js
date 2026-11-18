const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedLibrarian() {
  const username = process.env.SEED_LIBRARIAN_USERNAME || "librarian";
  const email = (process.env.SEED_LIBRARIAN_EMAIL || "librarian@library.local").toLowerCase();
  const password = process.env.SEED_LIBRARIAN_PASSWORD || "LibraryAdmin123!";

  if (password.length < 12) throw new Error("Seed librarian password must be at least 12 characters");
  const hashedPassword = await bcrypt.hash(password, 12);

  // Ensure no other account retains the librarian role.
  await User.updateMany({ role: "librarian", email: { $ne: email } }, { $set: { role: "patron" } });
  return User.findOneAndUpdate(
    { email },
    { $set: { username, password: hashedPassword, role: "librarian" }, $setOnInsert: { email } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
}

module.exports = seedLibrarian;
