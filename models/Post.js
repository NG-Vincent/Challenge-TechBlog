const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {}

Post.init(
   {
      id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true,
      },
      // title of post
      title: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      // contents of post
      post_content: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            len: [1],
         },
      },
      // user to wrote the post
      user_id: {
         type: DataTypes.INTEGER,
         references: {
            model: "user",
            key: "id",
         },
      },
   },
   {
      sequelize,
      freezeTableName: true,
      underscored: true,
      modelName: "post",
   }
);

module.exports = Post;