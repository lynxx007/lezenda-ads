import { Schema, model } from "mongoose";

interface IListing {
    title: string;
    longitude: number;
    latitude: number;
    image: string;
 
}

const listingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    image: { type: String, required: true },

  },
  { timestamps: true }
);



const Listing = model<IListing>("Listing", listingSchema);
export default Listing;
