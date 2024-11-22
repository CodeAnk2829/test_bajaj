require("dotenv").config();
const express = require("express");
const multer = require("multer");
const base64 = require("base64-js");

const app = express();
const port = process.env.PORT;

app.use(express.json()); 
const upload = multer();

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

app.post("/bfhl", upload.none(), (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    const numbers = data.filter((char) => !isNaN(char));
    const alphabets = data.filter((char) => isNaN(char));
    const lowercaseLetters = alphabets.filter(
      (char) => char === char.toLowerCase()
    );

    const highestLowercase = lowercaseLetters.sort().reverse()[0] || null;

    const primeFound = numbers.some((num) => isPrime(parseInt(num)));

    let fileValid = false;
    let mimeType = null;
    let fileSizeKB = null;

    if (file_b64) {
      try {
        const fileBuffer = Buffer.from(file_b64, "base64");
        fileValid = true;
        mimeType = "image/png"; 
        fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
      } catch (error) {
        fileValid = false;
      }
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
