import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

// Tour Type Schema
const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);
export const TourType = model<ITourType>("TourType", tourTypeSchema);

// Tour Schema
const tourSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: true,
    },
  },
  { timestamps: true }
);

// Create slug on create
tourSchema.pre("save", async function (next) {
  const slug = this.title?.toLowerCase().split(" ").join("-");
  this.slug = `${slug}`;

  next();
});

// Update slug on update
tourSchema.pre("findOneAndUpdate", async function (next) {
  const tour = this.getUpdate() as Partial<ITour>;

  const slug = tour.title?.toLowerCase().split(" ").join("-");
  tour.slug = slug;

  this.setUpdate(tour);

  next();
});

export const Tour = model("Tour", tourSchema);
