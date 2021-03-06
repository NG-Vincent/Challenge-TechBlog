const sequelize = require("../../config/connection");
const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// get all posts
router.get("/", (req, res) => {
   Post.findAll({
      order: [["created_at", "DESC"]],
      attributes: ["id", "content", "title", "created_at"],
      // get comments on the post
      include: [
         {
            // comment data
            model: Comment,
            attributes: [
               "id",
               "comment_text",
               "post_id",
               "user_id",
               "created_at",
            ],
            // user who wrote the comment
            include: {
               model: User,
               attributes: ["username"],
            },
         },
         // user who wrote the post
         {
            model: User,
            attributes: ["username"],
         },
      ],
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// get specific post
router.get("/:id", (req, res) => {
   Post.findOne({
      where: {
         id: req.params.id,
      },
      attributes: ["id", "content", "title", "created_at"],
      order: [["created_at", "DESC"]],
      // get comments on the post
      include: [
         {
            // comment data
            model: Comment,
            attributes: [
               "id",
               "comment_text",
               "post_id",
               "user_id",
               "created_at",
            ],
            // user who wrote the comment
            include: {
               model: User,
               attributes: ["username"],
            },
         },
         // user who wrote the post
         {
            model: User,
            attributes: ["username"],
         },
      ],
   })
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// create new post
router.post("/", withAuth, (req, res) => {
   Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
   })
      .then((dbPostData) => res.json(dbPostData))
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// update post
router.put("/:id", withAuth, (req, res) => {
   Post.update(
      {
         title: req.body.title,
         content: req.body.content,
      },
      {
         where: {
            id: req.params.id,
         },
      }
   )
      .then((dbPostData) => {
         if (!dbPostData) {
            res.status(404).json({ message: "No post found with this id" });
            return;
         }
         res.json(dbPostData);
      })
      .catch((err) => {
         console.log(err);
         res.status(500).json(err);
      });
});

// delete post
router.delete("/:id", withAuth, (req, res) => {
   // delete the post's comments first
   Comment.destroy({
      where: {
         post_id: req.params.id,
      },
   }).then(() => {
      // then delete the post
      Post.destroy({
         where: {
            id: req.params.id,
         },
      })
         .then((dbPostData) => {
            if (!dbPostData) {
               res.status(404).json({ message: "No post found with this id" });
               return;
            }
            res.json(dbPostData);
         })
         .catch((err) => {
            console.log(err);
            res.status(500).json(err);
         });
   });
});

module.exports = router;
