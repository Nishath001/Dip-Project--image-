const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const app = express();
const port = 4000;

/// Serve static files///
app.use(express.static(__dirname + "/public"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serving index.html to '/'
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/upload", upload.single("imageInput"), async (req, res) => {
  try {
    /// Load image///
    const image = sharp(req.file.buffer);

    /// Apply blur///
    const blurredImageBuffer = await image.blur(5).toBuffer();

    /// Apply sharpening to the blurred image///
    const sharpenedImageBuffer = await sharp(blurredImageBuffer).sharpen().toBuffer();

    /// Adjust contrast///
    const contrastedImageBuffer = await sharp(sharpenedImageBuffer).linear(1.5, 0).toBuffer();

    /// Adjust white balance///
    const balancedImageBuffer = await sharp(contrastedImageBuffer).modulate({ brightness: 1.2, saturation: 1.5 }).toBuffer();

    /// Convert the image to base64 format///
    const base64Encoded = balancedImageBuffer.toString("base64");
    const url = `data:image/jpeg;base64,${base64Encoded}`;

    /// Send the processed image///
    res.status(200).send({ data: url });
  } catch (err) {
    console.error("Error processing image:", err);
    res.status(500).send("Error processing image.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
