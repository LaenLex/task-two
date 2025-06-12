const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class auth_user extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  auth_user.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'auth_user',
    tableName: 'auth_users',
    timestamps: true
  });
  return auth_user;
}; 