import AppError from "../../error/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import httpStatus from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "../../constants";

/* ------------------ TOUR TYPE SERVICE ------------------ */
const createTourType = async (payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findOne({ name: payload.name });

  if (existingTourType) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A tour type already exists with this name!"
    );
  }

  return await TourType.create(payload);
};

const getAllTourType = async () => {
  const tourTypes = await TourType.find();
  const totalTour = await TourType.countDocuments();

  return {
    data: tourTypes,
    meta: {
      total: totalTour,
    },
  };
};

const getSingleTourType = async (id: string) => {
  const tourType = await TourType.findById(id);

  if (!tourType) {
    throw new AppError(httpStatus.NOT_FOUND, "Tour Type not found!");
  }

  return tourType;
};

const updateTourType = async (id: string, payload: Partial<ITourType>) => {
  const existingTourType = await TourType.findById(id);

  if (!existingTourType) {
    throw new AppError(httpStatus.CONFLICT, "The tour type is not available!");
  }

  const tourType = await TourType.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return tourType;
};

const deleteTourType = async (id: string) => {
  await TourType.findByIdAndDelete(id);
  return null;
};

/* ------------------ TOUR CONTROLLER ------------------ */
const createTour = async (payload: Partial<ITour>) => {
  const existingTour = await Tour.findOne({ title: payload.title });

  if (existingTour) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A tour is already exits with this name!"
    );
  }

  const tour = await Tour.create(payload);
  return tour;
};

const getAllTour = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Tour.find(), query);
  const tours = await queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    data,
    meta,
  };
};

const getSingleTour = async (id: string) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new AppError(httpStatus.NOT_FOUND, "No data found with this ID");
  }

  return await Tour.findByIdAndDelete(id);
};

const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new AppError(httpStatus.NOT_FOUND, "No data found with this ID");
  }

  const tour = await Tour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return tour;
};

const deleteTour = async (id: string) => {
  const existingTour = await Tour.findById(id);

  if (!existingTour) {
    throw new AppError(httpStatus.NOT_FOUND, "No data found with this ID");
  }

  return await Tour.findByIdAndDelete(id);
};

export const TourService = {
  createTour,
  getAllTour,
  getSingleTour,
  updateTour,
  deleteTour,
  createTourType,
  getAllTourType,
  getSingleTourType,
  updateTourType,
  deleteTourType,
};
