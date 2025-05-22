const axios = require("axios");
async function categorizeEmail(subject, body) {
  try {
    const res = await axios.post("http://localhost:8000/categorize", {
      subject,
      body
    });
    return res.data;
  } catch (err) {
    console.error("ML API error:", err.message);
    return null;
  }
}

// Example usage
categorizeEmail("Project Deadline", "Please submit the file by 5 PM").then(console.log);
