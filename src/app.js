import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// This below is how we do it professionally in production environment //
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// The meaning of this that we are accepting json data and here we can also set the limit for it. Now every device has its configurations. Earlier express coudn't take your json files so easily you needed to use the body parser. Now it uses bodyParser by default //
// This data is when you fill a form below //
app.use(express.json({ limit: "10kb" }));

// Now getting url data below //
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

export default app;
