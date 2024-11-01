const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  
  const user = req.user;
  return res.status(200).json({ success: true, user });
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Create New Review or Update the review
exports.createLikedMovie = catchAsyncErrors(async (req, res, next) => {
  const k = await User.findById(req.params.id).exec();
  const user = await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        Likedmovies: req.body,
      },
    }
  ).exec();
  res.status(200).json({
    user,
    success: true,
  });
});

// // Get All Reviews of a product
exports.getLikedMovies = catchAsyncErrors(async (req, res, next) => {
  console.log("Am i here")
  
  //   const product = await Product.findById(req.query.id);
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHander("user not found", 404));
  }

  res.status(200).json({
    success: true,
    LikedMovies: user.Likedmovies,
  });
});

// // Delete Review
exports.deleteLikedMovie = catchAsyncErrors(async (req, res, next) => {
  //const user = await Product.findById(req.query.productId);
  const user = await User.findById(req.query.userId);

  if (!user) {
    return next(new ErrorHander("user not found", 404));
  }
  const movies = user.Likedmovies.filter((movie) => movie.id != req.query.id);

  console.log(movies);

  await User.findOneAndUpdate(
    { _id: req.query.userId },
    {
      Likedmovies: movies,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
