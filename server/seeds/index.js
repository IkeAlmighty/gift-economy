import User from "../models/User.js";
import userData from "./seedUsers.js";
import db from "../db/connection.js";

db.once("open", seed);

async function seed() {
  try {
    // Clean existing data
    await User.deleteMany({});

    for (const user of userData) {
      await User.create(user);
    }

    console.log("Seed completed 🌱");
  } catch (err) {
    console.error("Seed failed ❌", err);
    console.log(err);
  }

  db.close();
}
