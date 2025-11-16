import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Upstream API (YouTube search/video downloader)
const UPSTREAM = "https://dens-videojs.vercel.app/api/video?query=";

// Browser-like headers
const BROWSER_HEADERS = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
  "Sec-Ch-Ua": "\"Chromium\";v=\"137\", \"Not(A)Brand\";v=\"24\"",
  "Sec-Ch-Ua-Mobile": "?1",
  "Sec-Ch-Ua-Platform": "\"Android\"",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Upgrade-Insecure-Requests": "1"
};

app.get("/", (req, res) => {
  res.send("YouTube Downloader API by Lord Itachi is running!");
});

// Downloader route
app.get("/download", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Missing ?query=",
    });
  }

  try {
    const url = UPSTREAM + encodeURIComponent(query);

    const response = await axios.get(url, {
      headers: BROWSER_HEADERS
    });

    res.json({
      success: true,
      author: "ItachiXD",
      source: "Itachi-Api",
      data: response.data
    });

  } catch (error) {
    console.error("❌ Upstream Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Upstream API error",
      error: error.response?.data || error.message
    });
  }
});

export default app;
