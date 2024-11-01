const express = require("express");
const {
  registerUser,

  loginUser,
  createLikedMovie,
  getLikedMovies,
  deleteLikedMovie,
  getUser,
} = require("../userController/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/liked/:id").post(isAuthenticatedUser, createLikedMovie);

router.route("/liked/:id").get(isAuthenticatedUser, getLikedMovies);

router.route("/liked").delete(isAuthenticatedUser, deleteLikedMovie);

router.route("/user").get(isAuthenticatedUser, getUser);

module.exports = router;
