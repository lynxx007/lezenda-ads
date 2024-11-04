import express from "express";
import ViteExpress from "vite-express";
import connectDb from "./config/dbConnect.js";
import Listing from "./models/listingModel.js";
import { db } from "../client/lib/orama.js";
import { insert, search } from "@orama/orama";
connectDb();
const app = express();

async function initialOrama() {
  const data = await Listing.find();
  for (const listing of data) {
    await insert(db, {
      title: listing.title,
      location: {
        lat: listing.latitude,
        lon: listing.longitude,
      },
    });
  }
  console.log("done");
}

initialOrama().catch(console.error);

app.get("/hello", async (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

app.get("/api/listings", async (req, res) => {
  try {
    const { lat, lng, title } = req.query;

    // If no coordinates provided, return all listings
    if (lat || lng) {
      const searchResult = await search(db, {
        where: {
          location: {
            radius: {
              coordinates: {
                lat: parseFloat(lat as string),
                lon: parseFloat(lng as string),
              },
              value: 2000,
            },
          },
        },
      });
      return res.json(searchResult.hits);
    }

    // Convert lat/lng to numbers
    // const latitude = parseFloat(lat as string);
    // const longitude = parseFloat(lng as string);

    // Increase the range for a wider search area, e.g., 0.1 degrees
    // const listings = await Listing.find({
    //   latitude: { $gte: latitude - 0.1, $lte: latitude + 0.1 },
    //   longitude: { $gte: longitude - 0.1, $lte: longitude + 0.1 },
    // });
    else {
      const searchResult = await search(db, {
        term: title as string,
      });

      res.json(searchResult.hits);
    }
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Error fetching listings" });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
