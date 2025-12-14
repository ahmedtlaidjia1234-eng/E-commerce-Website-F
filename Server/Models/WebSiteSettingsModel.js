const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database.js");

const WebsiteSettingsModel = sequelize.define(
  "WebsiteSettings",
  {
    colors: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        primaryColor: "#3B82F6",
        secondaryColor: "#8B5CF6",
        accentColor: "#F59E0B",
        backGroundColor: "#F9FAFB",
        surfaceColor: "#FFFFFF",
        primaryText: "#111827",
        secondaryText: "#6B7280",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      }),
    },

    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        enableReviews: false,
        enableShowProductRatings: false,
        enableNotifications: false,
        enableWishlist: false,
      }),
    },

    commerce: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        currency: "EUR",
        defaultShippingCost: 9.99,
        taxRate: 8,
      }),
    },

    security: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: () => ({
        enableTwoFactorAuthentication: false,
        sessionTimeout: 60,
        minimumPasswordLength: 8,
      }),
    },
  }
);

module.exports = WebsiteSettingsModel;
