require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

app.post("/bfhl", upload.single("file"), (req, res) => {
  try {
    let { data } = req.body;
    data = JSON.parse(data);
    const uploadedFile = req.file;
    
    const numbers = data ? data.filter((char) => !isNaN(char)) : [];
    const alphabets = data ? data.filter((char) => isNaN(char)) : [];
    const lowercaseLetters = alphabets.filter(
      (char) => char === char.toLowerCase()
    );
    const highestLowercase = lowercaseLetters.sort().reverse()[0] || null;
    const primeFound = numbers.some((num) => isPrime(parseInt(num)));

    let fileValid = false;
    let mimeType = null;
    let fileSizeKB = null;

    if (uploadedFile) {
      fileValid = true;
      mimeType = uploadedFile.mimetype;
      fileSizeKB = (uploadedFile.size / 1024).toFixed(2);
    }

    const response = {
      is_success: true,
      user_id: "harshita_chouksey",
      email: "harshitasgr15@gmail.com",
      roll_number: "0101EX211028",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      is_prime_found: primeFound,
      file_valid: fileValid,
      file_mime_type: mimeType,
      file_size_kb: fileSizeKB,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ is_success: false, message: "Server error" });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
