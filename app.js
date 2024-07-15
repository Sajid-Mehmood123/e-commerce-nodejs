require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const morgan = require("morgan");

// database
const connectDB = require("./db/connect");

const authRouter = require("./routes/auth.routes");

// error handler
const notFoundErrorMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);

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
