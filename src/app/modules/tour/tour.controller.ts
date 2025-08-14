/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

/* ------------------ TOUR TYPE CONTROLLER ------------------ */
export const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.createTourType(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour type created successfully",
      data: tourType,
    });
  }
);

export const getAllTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.getAllTourType();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour type retrieved successfully",
      data: tourType.data,
      meta: tourType.meta,
    });
  }
);

export const getSingleTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.getSingleTourType(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour Type data retrieved successfully",
      data: tourType,
    });
  }
);

export const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.updateTourType(req.params.id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour type updated successfully",
      data: tourType,
    });
  }
);

export const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourService.deleteTourType(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour type deleted successfully",
      data: tourType,
    });
  }
);

/* ------------------ TOUR CONTROLLER ------------------ */
export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.createTour(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Tour created successfully",
      data: tour,
    });
  }
);

export const getAllTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const tour = await TourService.getAllTour(query as Record<string, string>);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All tour data retrieved successfully",
      data: tour.data,
      meta: tour.meta,
    });
  }
);

export const getSingleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.getSingleTour(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour data retrieved successfully",
      data: tour,
    });
  }
);

export const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.updateTour(req.params.id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour updated successfully",
      data: tour,
    });
  }
);

export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await TourService.deleteTour(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Tour deleted successfully",
      data: tour,
    });
  }
);
