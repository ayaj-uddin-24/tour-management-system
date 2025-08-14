import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create slug on create
divisionSchema.pre("save", async function (next) {
  const slug = this.name?.toLowerCase().split(" ").join("-");
  this.slug = `${slug}-division`;

  next();
});

// Update slug on update
divisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as Partial<IDivision>;

  const slug = division.name?.toLowerCase().split(" ").join("-");
  division.slug = `${slug}-division`;

  this.setUpdate(division);

  next();
});

export const Division = model<IDivision>("Division", divisionSchema);
