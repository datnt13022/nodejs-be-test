import { Request, Response } from "express";
import Driver from "../models/Driver";
import { FindManyOptions, FindOperator, Like, getRepository } from "typeorm";

export const searchDrivers = async (req: Request, res: Response) => {
  const {
    year,
    nationality,
    searchString,
    points,
    position,
    page,
    limit,
    sortBy,
    sortOrder,
  } = req.query;
  const driverRepository = getRepository(Driver);
  try {
    const queryOptions: FindManyOptions<Driver> = {
      where: {},
      order: {},
      skip: 0,
      take: 10,
    };
    if (year) {
      queryOptions.where = { ...queryOptions.where, year: String(year) };
    }
    if (nationality) {
      queryOptions.where = {
        ...queryOptions.where,
        nationality: String(nationality),
      };
    }
    if (searchString) {
      queryOptions.where = {
        ...queryOptions.where,
        driver: Like(`%${searchString}%`),
      };
    }
    if (points) {
      queryOptions.where = { ...queryOptions.where, points: String(points) };
    }
    if (position) {
      queryOptions.where = {
        ...queryOptions.where,
        position: String(position),
      };
    }
    if (page) {
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;
      queryOptions.skip = (pageNumber - 1) * limitNumber;
      queryOptions.take = limitNumber;
    }
    if (sortBy) {
      const order: "ASC" | "DESC" = sortOrder === "desc" ? "DESC" : "ASC";
      if (sortBy === "year") {
        queryOptions.order = { year: order };
      } else if (sortBy === "points") {
        queryOptions.order = { points: order };
      } else if (sortBy === "position") {
        queryOptions.order = { position: order };
      }else if (sortBy === "time"){
        queryOptions.order = {};
      }
    }
    const [drivers, totalCount] = await driverRepository.findAndCount(
      queryOptions
    );
    const totalPages = Math.ceil(totalCount / queryOptions.take);
    res.json({ drivers, totalPages });
  } catch (error) {
    console.error("Error searching drivers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
