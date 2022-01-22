const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// get all of user's posts
router.get("/", withAuth, (req, res) => {
   Post.findAll({
      where: {
         // use the ID from the session
         user_id: req.session.user_id,
      },
      attributes: ["id", "post_url", "title", "created_at"],
   })
      .then((dbPostData) => {
         // serialize data before passing to template
         const posts = dbPostData.map((post) => post.get({ plain: true }));
         res.render("dashboard", { posts, loggedIn: req.session.loggedIn });
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// edit a user's post
router.get("/edit/:id", withAuth, (req, res) => {
   Post.findOne({
      where: { id: req.params.id },
      attributes: ["id", "post_url", "title", "created_at"],
   }).then((dbPostData) => {
      const post = dbPostData.get({ plain: true });
      res.render("edit-post", { post, loggedIn: req.session.loggedIn });
   });
});

module.exports = router;
