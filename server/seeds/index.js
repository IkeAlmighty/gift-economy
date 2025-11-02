import User from "../models/User.js";
import userData from "./seedUsers.js";
import db from "../db/connection.js";

db.once("open", seed);

async function seed() {
  try {
    // Clean existing data
    await User.deleteMany({});

    // Create test users
    for (const user of userData) {
      await User.create(user);
    }

    // Connect some users to eachother
    for (let i = 0; i < userData.length; i++) {
      const user = await User.findOne({ username: userData[i].username });
      for (let j = 0; j < Math.random() * userData.length; j++) {
        const randomIndex = Math.floor(Math.random() * userData.length);
        const connection = await User.findOne({ username: userData[randomIndex].username });
        connection.connections.addToSet(user);
        user.connections.addToSet(connection);

        await connection.save();
        await user.save();
      }
    }

    console.log("Seed completed 🌱");
  } catch (err) {
    console.error("Seed failed ❌", err);
    console.log(err);
  }

  db.close();
}
