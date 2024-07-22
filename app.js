require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// rest packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// database
const connectDB = require("./db/connect");
// routes
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const productRouter = require("./routes/product.routes");
const reviewRouter = require("./routes/review.routes");

// error handler
const notFoundErrorMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

// routes
app.get("/api/v1", (req, res) => {
  //   console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("E-Commerce api");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(notFoundErrorMiddleware);
app.use(errorHandlerMiddleware);

// port
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is running on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
