import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "data", "basquiat.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const artworks = JSON.parse(jsonData);

    // Map image paths to a public URL served by the API
    const artworksWithUrls = artworks.artworks.map(art => ({
      ...art,
      image: `/api/images/${art.image}`
    }));

    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    res.status(200).json({ artworks: artworksWithUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load data" });
  }
}
