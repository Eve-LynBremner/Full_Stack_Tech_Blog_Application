// create a new router
const app = require("express").Router();

// import the models
const { Category } = require("../models/index");

// Route to get all categories
app.get("/", async (req, res) => {
  try {
    console.log("Getting all categories");
    const categories = await Category.findAll();
    console.log(categories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error: error });
  }
});

// export the router
module.exports = app;
