import express from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const PORT = process.env.PORT;

let app = express();
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  //any route not defined will be send to index.html
  app.use("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API running");
  });
}

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
