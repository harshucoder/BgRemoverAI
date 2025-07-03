import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { promisify } from "util";

const router = express.Router();
const app = express();

// Create uploads and output directories if they don't exist
[ "uploads", "output" ].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const upload = multer({ dest: "uploads/" });
const execPromise = promisify(exec);

router.post("/", upload.single("image"), async (req, res): Promise<void> => {
  try {
    if (!req.file || !req.file.path) {
      res.status(400).send("No file uploaded");
      return;
    }

    const inputPath = req.file.path;
    const outputFilename = `${req.file.filename}.png`;
    const outputPath = path.join("output", outputFilename);

    await execPromise(`rembg i ${inputPath} ${outputPath}`);

    res.sendFile(path.resolve(outputPath), (err) => {
      try { fs.unlinkSync(inputPath); } catch (e) {}
      try { fs.unlinkSync(outputPath); } catch (e) {}
    });
  } catch (error:any) {
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    console.error("Error processing image:", error.message || error);
    res.status(500).send("Error processing image");
  }
});


export default router;