// create a new router
const app = require("express").Router();

// import the models
const { Post } = require("../models/index");

const { signToken, authMiddleware } = require("../utils/auth");

const { Sequelize } = require("sequelize");


// Route to add a new post - added middleware as need user id info
app.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, postedBy, categoryId } = req.body;
    const post = await Post.create({ title, content, postedBy, createdOn: new Date(), categoryId, userId: req.user.id});

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error adding post" });
  }
});

// Route to get all posts
app.get("/", async (req, res) => {
  try {
    // include category and user because we reference their properties in script.js
    const posts = await Post.findAll({ include: ["category", "user"] }); 
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts", error });
  }
});

// Route to get posts by categoryId
app.get("/:categoryId", async (req, res) => {
  try {
    // include category and user because we reference their properties in script.js
    const post = await Post.findAll({
      include: ["category" , "user"] ,
      where: { categoryId: req.params.categoryId },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
});

// Route to update a post
app.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, postedBy, categoryId } = req.body;
    const post = await Post.update(
      { title, content, postedBy, categoryId },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Route to delete a post
app.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

// export the router
module.exports = app;
