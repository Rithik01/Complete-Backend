import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APIResponse.js";

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
  if (!username || !email || !fullName || !password) {
    throw new ApiError(400, "Please fill all the fields");
  }
  // Finds the first occurence of the user //
  const foundUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (foundUser) {
    throw new ApiError(409, "This  email or username is already in use.");
  }
  // Here we take the first object because first property ke andar ek path milta hai here uska proper path aapko miljayega jo multer ne upload kia hai //
  // console.log(req.files);

  // Here below we named it as localPath because abhi vo humare server pe hai cloudinary pe nai gaya hai //
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

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
  const createdUser = await user
    .findById(user._id)
    .select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering a user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
