import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/APIError.js";
// import { ApiError } from "../utils/APIError";

// This we have provided with _ because we are not using res here //
// export const verifyJWT = asyncHandler(async (req, _, next) => {
//   // The meaning of this below is ya toh cookies se token nikal lo ya toh header se nikal lo //
//   try {
//     const token =
//       req.cookies?.accesstoken ||
//       req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       throw new ApiError(401, "Unauthorized Request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );
//     if (!user) {
//       throw new ApiError(401, "Invalid access token ");
//     }

//     //  now giving the access of request to user //
//     req.user = user;
//     console.log(req.user);
//     next();
//   } catch (error) {
//     throw new ApiError(401, err?.message || "Invalid access token");
//   }
// });

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
