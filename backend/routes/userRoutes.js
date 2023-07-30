const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();
const {
  allUsers,
  registerUser,
  authUser,
} = require("../controllers/registerUser.js");

// console.log("useRoutes-5");
router.route("/").post(registerUser);
router.route("/").get(protect, allUsers);

router.post("/login", authUser);
module.exports = router;
