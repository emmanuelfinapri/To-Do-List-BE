const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5555;

// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to the DataBase"))
  .catch(() => console.log("not connected to DataBase"));

//use middlewares
app.use(cookieParser());
app.use(express.json());

// use routers
app.use(authRoute);
app.use(userRoute);

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
