// Note when you will use JSON in postman you cannot send files so we will use form-data //

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { ApiError } from "../utils/APIError.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    // The user is a document
    const user = User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // Now setting the refresh token in the database //
    user.refreshToken = refreshToken;
    // now saving it below //
    // The meaning of this below is validation kuch mat lagao aap sidha jaake save kardo //
    await user.save({ validateBeforeSave: false });

    /// Now return both the access token and refresh token below ///
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Get the user details from from frontend //
  // validation - not empty //
  // check if email is already in use //
  // check for images and avatar //
  // upload to cloudinary, avatar //
  // Now the first step is that hume ek object banana padega because of nosql database usme data aise hi store hota hai //
  // remove password and refresh token field from response because we do not want to send it to the user at frontend //
  // check for user creation //
  // if created then return res //

  // 1
  const { username, email, fullName, password } = req.body;
  console.log(req.body);
  if (!username || !email || !fullName || !password) {
    throw new ApiError(400, "Please fill all the fields");
  }
  // Finds the first occurence of the user //
  const foundUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (foundUser) {
    throw new ApiError(409, "This  email or username is already in use.");
  }
  // Here we take the first object because first property ke andar ek path milta hai here uska proper path aapko miljayega jo multer ne upload kia hai //
  console.log(req.files);

  // Here below we named it as localPath because abhi vo humare server pe hai cloudinary pe nai gaya hai //
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  /// Now we need to upload it on cloudinary ///
  // This will take time so we'll use await //
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Now we have created an object //
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Now ab merepas saara response aaya but do fields select hoke nai aayi hai jo hai password and refreshToken //
  // When preparing responses to send back to the client, it's common practice to exclude sensitive information like passwords. In the case of your code, the .select("-password -refreshToken") part ensures that the password and refreshToken fields are not included in the user object returned by the server.
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

// Login User //
const loginUser = asyncHandler(async (req, res) => {
  //  take the email and password from req.body //
  // check if the fields are not empty //
  // to check if the user is a registered user //
  // compare email and password on the database and the one which the user entered meaning find the user //
  //  If they match then create access and refresh tokens for that particular user and send them to the user //
  // else send error message //
  /// send the access and refresh tokens via secure cookies ///
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(409, "Please fill all the fields");
  }
  // Finding the user below (registered)
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "Sorry the user does not exists");
  }

  // Password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Passwords do not match");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  //// Now sending the cookies below which you send in the form of an object//
  //// By default the users can modify the cookies in the frontend but when you pass httpOnly:true and secure::true so only the person sitting on the server can modify them //
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      200,
      // This below is your data which we have setted in the ApiResponse class which is this.data = data
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged in successfully"
    );

  // Now create access and refresh token which is very common so we will make a function //
});

// Logout user //
const logoutUser = asyncHandler(async (req, res) => {
  // There are generally two steps for logging out a user //
  // First is clearing out the cookies //
  // Clearing out the refresh token //
  // Designing our own middleware //
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    // Now here below you will get a new value with no refresh token //
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
