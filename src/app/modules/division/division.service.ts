import AppError from "../../error/AppError";
import { IDivision } from "./division.interface";
import httpStatus from "http-status-codes";
import { Division } from "./division.model";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { divisionSearchableFields } from "../../constants";

// Create division service
const createDivision = async (payload: Partial<IDivision>) => {
  const existingDivision = await Division.findOne({ name: payload.name });

  if (existingDivision) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A division with this name already exist!"
    );
  }

  const division = await Division.create(payload);
  return division;
};

// Get all division service
const getAllDivisions = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Division.find(), query);
  const divisions = await queryBuilder
    .search(divisionSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    divisions.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

// Get single division
const getSingleDivision = async (slug: string) => {
  const division = await Division.find({ slug });
  return division;
};

// Update division
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await Division.findById(id);

  if (!existingDivision) {
    throw new AppError(httpStatus.NOT_FOUND, "Division not found! ");
  }

  const duplicateDivision = await Division.findOne({
    name: payload.name,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A division already exist with this name!"
    );
  }

  const updatedDivision = await Division.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedDivision;
};

// Delete division
const deleteDivision = async (id: string) => {
  await Division.findByIdAndDelete(id);
};

export const divisionService = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
