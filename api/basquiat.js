import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Get the absolute path to your JSON file
    const filePath = path.join(process.cwd(), "data", "basquiat.json");

    // Read and parse it
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    // Send JSON to the client
    res.status(200).json(data);
  } catch (err) {
    console.error("Error loading basquiat.json:", err);
    res.status(500).json({ error: "Failed to load basquiat data" });
  }
}
