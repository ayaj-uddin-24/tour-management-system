/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { divisionService } from "./division.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// Create division controller
export const createDivision = catchAsync(
  async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      thumbnail: req.file?.path,
    };
    const division = await divisionService.createDivision(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division created successfully",
      data: division,
    });
  }
);

// Get all divisions controller
export const getAllDivisions = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.params;
    const division = await divisionService.getAllDivisions(
      query as Record<string, string>
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All divisions retrieved successfully",
      data: division.data,
      meta: division.meta,
    });
  }
);

// Get division by slug
export const getSingleDivision = catchAsync(
  async (req: Request, res: Response) => {
    const slug = req.params.slug;
    const division = await divisionService.getSingleDivision(slug);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division retrieved successfully",
      data: division[0],
    });
  }
);

// Update division
export const updatedDivision = catchAsync(
  async (req: Request, res: Response) => {
    const division = await divisionService.updateDivision(
      req.params.id,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Division updated successfully",
      data: division,
    });
  }
);

// Delete division
export const deleteDivision = catchAsync(
  async (req: Request, res: Response) => {
    await divisionService.deleteDivision(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Division removed successfully",
      data: null,
    });
  }
);
