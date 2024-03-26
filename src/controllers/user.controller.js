// Note when you will use JSON in postman you cannot send files so we will use form-data //

// Now if someone is saying you to update files then keep them in different contollers. It's a better approach //

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIResponse.js";
import { ApiError } from "../utils/APIError.js";
import jwt from "jsonwebtoken";

// const generateAccessAndRefreshTokens = async (userId) => {
//   try {
//     // The user is a document
//     const user = await User.findById(userId);
//     const accessToken = user.generateAccessToken();
//     const refreshToken = user.generateRefreshToken();
//     // Now setting the refresh token in the database //
//     user.refreshToken = refreshToken;
//     // now saving it below //
//     // The meaning of this below is validation kuch mat lagao aap sidha jaake save kardo //
//     await user.save({ validateBeforeSave: false });

//     /// Now return both the access token and refresh token below ///
//     return { accessToken, refreshToken };
//   } catch (error) {
//     throw new ApiError(
//       500,
//       "Something went wrong while generating refresh and access tokens"
//     );
//   }
// };

// const registerUser = asyncHandler(async (req, res) => {
//   // Get the user details from from frontend //
//   // validation - not empty //
//   // check if email is already in use //
//   // check for images and avatar //
//   // upload to cloudinary, avatar //
//   // Now the first step is that hume ek object banana padega because of nosql database usme data aise hi store hota hai //
//   // remove password and refresh token field from response because we do not want to send it to the user at frontend //
//   // check for user creation //
//   // if created then return res //

//   // 1
//   const { username, email, fullName, password } = req.body;
//   console.log(req.body);
//   if (!username || !email || !fullName || !password) {
//     throw new ApiError(400, "Please fill all the fields");
//   }
//   // Finds the first occurence of the user //
//   const foundUser = await User.findOne({
//     $or: [{ email }, { username }],
//   });
//   if (foundUser) {
//     throw new ApiError(409, "This  email or username is already in use.");
//   }
//   // Here we take the first object because first property ke andar ek path milta hai here uska proper path aapko miljayega jo multer ne upload kia hai //
//   console.log(req.files);

//   // Here below we named it as localPath because abhi vo humare server pe hai cloudinary pe nai gaya hai //
//   const avatarLocalPath = req.files?.avatar[0]?.path;
//   // const coverImageLocalPath = req.files?.coverImage[0]?.path;

//   let coverImageLocalPath;
//   if (
//     req.files &&
//     Array.isArray(req.files.coverImage) &&
//     req.files.coverImage.length > 0
//   ) {
//     coverImageLocalPath = req.files.coverImage[0].path;
//   }

//   if (!avatarLocalPath) {
//     throw new ApiError(400, "Avatar file is required");
//   }

//   /// Now we need to upload it on cloudinary ///
//   // This will take time so we'll use await //
//   const avatar = await uploadOnCloudinary(avatarLocalPath);
//   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

//   if (!avatar) {
//     throw new ApiError(400, "Avatar file is required");
//   }

//   // Now we have created an object //
//   const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     email,
//     password,
//     username: username.toLowerCase(),
//   });

//   // Now ab merepas saara response aaya but do fields select hoke nai aayi hai jo hai password and refreshToken //
//   // When preparing responses to send back to the client, it's common practice to exclude sensitive information like passwords. In the case of your code, the .select("-password -refreshToken") part ensures that the password and refreshToken fields are not included in the user object returned by the server.
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );
//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while registering a user");
//   }
//   return res
//     .status(201)
//     .json(new ApiResponse(200, createdUser, "User registered Successfully"));
// });

// // Login User //
// const loginUser = asyncHandler(async (req, res) => {
//   //  take the email and password from req.body //
//   // check if the fields are not empty //
//   // to check if the user is a registered user //
//   // compare email and password on the database and the one which the user entered meaning find the user //
//   //  If they match then create access and refresh tokens for that particular user and send them to the user //
//   // else send error message //
//   /// send the access and refresh tokens via secure cookies ///
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new ApiError(409, "Please fill all the fields");
//   }
//   // Finding the user below (registered)
//   const user = await User.findOne({
//     // $or: [{ username }, { email }],
//     email,
//   });
//   if (!user) {
//     throw new ApiError(404, "Sorry the user does not exists");
//   }

//   // Password check
//   const isPasswordValid = await user.isPasswordCorrect(password);
//   if (!isPasswordValid) {
//     throw new ApiError(404, "Passwords do not match");
//   }

//   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
//     user._id
//   );

//   const loggedInUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   //// Now sending the cookies below which you send in the form of an object//
//   //// By default the users can modify the cookies in the frontend but when you pass httpOnly:true and secure::true so only the person sitting on the server can modify them //
//   const options = {
//     httpOnly: true,
//     secure: true,
//   };

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .json(
//       200,
//       // This below is your data which we have setted in the ApiResponse class which is this.data = data
//       {
//         user: loggedInUser,
//         accessToken,
//         refreshToken,
//       },
//       "User logged in successfully"
//     );

//   // Now create access and refresh token which is very common so we will make a function //
// });

// // Logout user //
// const logoutUser = asyncHandler(async (req, res) => {
//   // There are generally two steps for logging out a user //
//   // First is clearing out the cookies //
//   // Clearing out the refresh token //
//   // Designing our own middleware //
//   User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         refreshToken: undefined,
//       },
//     },
//     // Now here below you will get a new value with no refresh token //
//     {
//       new: true,
//     }
//   );
//   const options = {
//     httpOnly: true,
//     secure: true,
//   };
//   return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .json(new ApiResponse(200, {}, "User logged out successfully"));
// });

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  // if (
  //   [fullName, email, username, password].some((field) => field?.trim() === "")
  // ) {
  //   throw new ApiError(400, "All fields are required");
  // }
  if (!fullName || !email || !username || !password) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0].path;
  // console.log(avatarLocalPath);
  console.log(req.files);
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files?.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // console.log(avatar);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, username, password } = req.body;
  // console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")

  // }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "Please register yourself first");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(loggedInUser);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
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
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  // Verifying the token now we will get decoded token //
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", newRefreshToken)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid password");
  }

  // Update the user's password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  // Create an instance of ApiResponse with the success message
  const apiResponse = new ApiResponse(200, {
    message: "Your password was changed successfully",
  });

  // Send the ApiResponse object as JSON response
  return res.status(200).json(apiResponse);
});

// Get current user //
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(401, "All the fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    {
      new: true,
      select: "-password",
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, { message: "User updated successfully" }));
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const userToDelete = await User.findByIdAndDelete(req.user?._id);
  if (!userToDelete) {
    return ApiError(404, "Oops, User Not Found");
  }
  return res
    .status(200)
    .json(200, null, { message: "User deleted Successfully" });
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarPath = req.file?.path;
  if (!avatarPath) {
    throw new ApiError(400, "No image provided");
  }
  const uploadedFile = uploadOnCloudinary(avatarPath);
  if (!uploadedFile.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: uploadedFile.url,
      },
    },
    { new: true }
  )
    .select("-password")
    .json(new ApiResponse(200, user, "Avatar image updates succcessfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  deleteUser,
};
