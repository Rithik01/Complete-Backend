import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(201).json({ message: "User created" });
  console.log("User created", req.body);
});

export { registerUser };
