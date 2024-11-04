import { create, insertMultiple } from "@orama/orama";
import data from "../data/data.json";
export const db = create({
  schema: {
    title: "string",
    location: "geopoint",
    image: "string",
  },
});

// await insertMultiple(db, data);
