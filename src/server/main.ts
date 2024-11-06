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
    const { lat, lng, title, zoom } = req.query;

    if (lat || lng) {
      const parsedZoom = parseInt(zoom as string);

      if (parsedZoom >= 8 && parsedZoom <= 10) {
        const searchResult = await search(db, {
          where: {
            location: {
              radius: {
                coordinates: {
                  lat: parseFloat(lat as string),
                  lon: parseFloat(lng as string),
                },
                value: 100000000,
                inside: true,
                unit: "km",
              },
            },
          },
          limit: 100,
        });
        return res.json(searchResult.hits);
      }
      if (parsedZoom === 11) {
        const searchResult = await search(db, {
          where: {
            location: {
              radius: {
                coordinates: {
                  lat: parseFloat(lat as string),
                  lon: parseFloat(lng as string),
                },
                value: 15000,
                inside: true,
              },
            },
          },
          limit: 100,
        });
        return res.json(searchResult.hits);
      }
      if (parsedZoom === 12) {
        // Define search behavior for zoom level 13
        const searchResult = await search(db, {
          where: {
            location: {
              radius: {
                coordinates: {
                  lat: parseFloat(lat as string),
                  lon: parseFloat(lng as string),
                },
                value: 5000,
                inside: true,
              },
            },
          },
          limit: 100,
        });
        return res.json(searchResult.hits);
      }
      if (parsedZoom >= 13) {
        const searchResult = await search(db, {
          where: {
            location: {
              radius: {
                coordinates: {
                  lat: parseFloat(lat as string),
                  lon: parseFloat(lng as string),
                },
                value: 5000,
                inside: true,
              },
            },
          },
          limit: 100,
        });
        return res.json(searchResult.hits);
      }
    } else {
      const searchResult = await search(db, {
        term: title as string,
        limit: 100,
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
