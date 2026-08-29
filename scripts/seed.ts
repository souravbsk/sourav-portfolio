/**
 * Seeds the profile, skills and experience collections from the content carried
 * over from the previous version of the site.
 *
 * It deliberately does NOT touch the existing `Projects` collection — those
 * documents are already live and no migration is needed.
 *
 * Run with: npm run seed
 */
import { config } from "dotenv";
import mongoose from "mongoose";

import {
  DEFAULT_EXPERIENCES,
  DEFAULT_PRODUCTS,
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
} from "../lib/default-content";
import { Experience, Product, Profile, Project, Skill } from "../lib/models";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const FORCE = process.argv.includes("--force");

async function main() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "souravPortfolio";

  if (!uri) {
    console.error(
      "MONGODB_URI is not set. Copy .env.example to .env.local first.",
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName });
  console.log(`Connected to "${dbName}".`);

  const existingProjects = await Project.countDocuments();
  console.log(
    `Found ${existingProjects} existing project document(s) — left untouched.`,
  );

  // Profile is a singleton keyed on "primary", so this is safe to re-run.
  const profileExists = await Profile.exists({ key: "primary" });
  if (profileExists && !FORCE) {
    console.log("Profile already exists — skipping (use --force to overwrite).");
  } else {
    await Profile.findOneAndUpdate(
      { key: "primary" },
      { $set: { ...DEFAULT_PROFILE, key: "primary" } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log("Profile seeded.");
  }

  const skillCount = await Skill.countDocuments();
  if (skillCount > 0 && !FORCE) {
    console.log(`${skillCount} skill(s) already present — skipping.`);
  } else {
    if (FORCE) await Skill.deleteMany({});
    await Skill.insertMany(DEFAULT_SKILLS);
    console.log(`${DEFAULT_SKILLS.length} skills seeded.`);
  }

  const experienceCount = await Experience.countDocuments();
  if (experienceCount > 0 && !FORCE) {
    console.log(`${experienceCount} experience entr(ies) already present — skipping.`);
  } else {
    if (FORCE) await Experience.deleteMany({});
    await Experience.insertMany(DEFAULT_EXPERIENCES);
    console.log(`${DEFAULT_EXPERIENCES.length} experience entries seeded.`);
  }

  const productCount = await Product.countDocuments();
  if (productCount > 0 && !FORCE) {
    console.log(`${productCount} product link(s) already present — skipping.`);
  } else if (DEFAULT_PRODUCTS.length > 0) {
    if (FORCE) await Product.deleteMany({});
    await Product.insertMany(DEFAULT_PRODUCTS);
    console.log(`${DEFAULT_PRODUCTS.length} product links seeded.`);
  } else {
    console.log("No default product links — add them from /admin/products.");
  }

  // Backfills the two fields the old admin form wrote inconsistently, so the
  // category filter and manual ordering work on legacy documents too.
  const backfilled = await Project.updateMany(
    { category: { $exists: false } },
    { $set: { category: "react", order: 0 } },
  );
  if (backfilled.modifiedCount > 0) {
    console.log(
      `Backfilled category/order on ${backfilled.modifiedCount} legacy project(s).`,
    );
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
