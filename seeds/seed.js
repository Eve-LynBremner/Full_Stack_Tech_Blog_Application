// Import required packages
const sequelize = require("../config/connection");

// import models
const { Post, Category } = require("../models");

// add data and seeding for Category model

// import seed data
const postData = require("./posts.json");

const categoryData = require("./categories.json");

// Seed database
const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await Post.bulkCreate(postData);

  await Category.bulkCreate(categoryData);

  process.exit(0);
};

// Call seedDatabase function
seedDatabase();
