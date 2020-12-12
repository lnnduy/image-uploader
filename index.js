const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const os = require("os");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();
const storage = multer.diskStorage({});
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
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

app.post("/uploads", upload.single("image"), async (req, res) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      public_id: "lnnduy/image-uploads/" + (Date.now() % 5),
      overwrite: true,
      resource_type: "image",
    });
    res.json({
      success: true,
      url: uploadResult.url,
    });
  } catch (error) {
    res.json({ success: false });
    console.log(error);
  }
});

if (process.env.NODE_ENV !== "production") {
  app.use(express.static("client/build/"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(PORT));
