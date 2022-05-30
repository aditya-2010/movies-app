const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () =>
  console.log("connected to DB!")
);

app.use(cookieParser());
app.use(express.json());

// Api routes
app.use("/api/users", require("./routes/users"));
app.use("/api/favorite", require("./routes/playlist"));
app.use("/api/like", require("./routes/like"));

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join("client/build")));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
