// Like mongoose gives us the capability of defining middlewares like that it gives us the functionality to inject methods also //
// I am not talking about the methods that mongoose gives you like updateMany, deleteMany i am saying custom methods //
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Now kisi bhi field ko agar aapne searchable bnana hai optimized tareeke se so do its index to true taaki ye database ki searching me aane lag jayee //
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Here below hum directly aise callback function nai pass kar skte () => {} because arrow function ke pass khud ka context nai hota so yaha pe function wala syntax likha jayega kyuki yaha context ki bahut zada importance hai //

// But now we have a problem jab bhi ye data save hoga password ko ye save karega suppose ek user aya usne apni photo change kari jaise hi usne save pe click kia voh password change hojayega //
// Meaning of this is that ki agar password modify hua hai toh hi isko change karo otherwise nai
userSchema.pre("save", async function (req, res, next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// userSchema.methods.isPass = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };

// This password is which user entered and this.password is encrypted one //
// Jaise pre ke pass access hota this ka same function ko bhi hota //
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Both are jwt tokens the only difference is between their usage //
userSchema.method.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

/// Refresh token below //
userSchema.method.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
