import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Listing from "../models/Listing.js";
import Tag from "../models/Tag.js";
import userData from "./seedUsers.js";
import { listingTitles } from "./seedListings.js";
import tagData from "./seedTags.js";
import db from "../db/connection.js";

db.once("open", seed);

async function seed() {
  try {
    // Clean existing data
    await User.deleteMany({});
    await Notification.deleteMany({});
    await Listing.deleteMany({});
    await Tag.deleteMany({});

    console.log("Existing data cleared.");

    // Create default tags
    for (const tag of tagData) {
      await Tag.create({ name: tag.name, emoji: tag.emoji });
    }

    // Create test users
    for (const user of userData) {
      await User.create(user);
    }

    // Connect some users to eachother
    for (let i = 0; i < userData.length; i++) {
      const user = await User.findOne({ username: userData[i].username });

      // for each user add a couple listings:
      for (let k = 0; k < Math.random() * 3; k++) {
        const listingData = listingTitles[Math.floor(Math.random() * listingTitles.length)];
        const listing = await Listing.create({
          title: listingData.title,
          description: listingData.description,
          intent: ["GIFT", "REQUEST", "PROJECT"][Math.floor(Math.random() * 3)],
          tags: listingData.tags,
          creator: user._id,
        });
        user.listings.addToSet(listing);
      }

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
