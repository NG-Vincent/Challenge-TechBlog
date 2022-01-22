const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Comment extends Model {}

Comment.init(
   {
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },
      // contents of the comment
      comment_text: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: [1],
         },
      },
      // the user who wrote the comment
      user_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "user",
            key: "id",
         },
      },
      // the post on which the comment is written
      post_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "post",
            key: "id",
         },
      },
   },
   {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: "comment",
   }
);

module.exports = Comment;
