const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const os = require("os");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      (Date.now() % 5) + "." + file.originalname.split(".").reverse()[0]
    );
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image")) cb(null, false);
    cb(null, true);
  },
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post("/uploads", upload.single("image"), (req, res) => {
  res.json({
    success: true,
    url: "/uploads/" + req.file.filename,
  });
});

if (process.env.NODE_ENV !== "production") {
  app.use(express.static("../client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(PORT));
