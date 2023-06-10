import { Request, Response } from "express";
import FastestLap from "../models/FastestLap";
import { getRepository, FindManyOptions, Like } from "typeorm";

export const searchFastestLap = async (req: Request, res: Response) => {
  const { year, grandPrix, driver, car, page, limit, sortBy, sortOrder } =
    req.query;

  const fastestLapRepository = getRepository(FastestLap);

  try {
    const queryOptions: FindManyOptions<FastestLap> = {
      where: {},
      order: {},
      skip: 0,
      take: 10,
    };

    if (year) {
      queryOptions.where = { ...queryOptions.where, year: String(year) };
    }

    if (grandPrix) {
      queryOptions.where = {
        ...queryOptions.where,
        grandPrix: Like(`%${grandPrix}%`),
      };
    }

    if (driver) {
      queryOptions.where = {
        ...queryOptions.where,
        driver: Like(`%${driver}%`),
      };
    }

    if (car) {
      queryOptions.where = { ...queryOptions.where, car: Like(`%${car}%`) };
    }

    if (sortBy) {
      const order: "ASC" | "DESC" = sortOrder === "desc" ? "DESC" : "ASC";

      if (sortBy === "year") {
        queryOptions.order = { year: order };
      } else if (sortBy === "grandPrix") {
        queryOptions.order = { grandPrix: order };
      } else if (sortBy === "driver") {
        queryOptions.order = { driver: order };
      }
    }

    if (page) {
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;
      queryOptions.skip = (pageNumber - 1) * limitNumber;
      queryOptions.take = limitNumber;
    }

    const [fastestLaps, totalCount] = await fastestLapRepository.findAndCount(
      queryOptions
    );
    if (sortBy === 'time' && sortOrder) {
        fastestLaps.sort((a, b) => {
          const timeA = parseInt(a.time.replace(/[:.]/g, ''), 10);
          const timeB = parseInt(b.time.replace(/[:.]/g, ''), 10);
  
          if (sortOrder === 'desc') {
            return timeB - timeA;
          } else {
            return timeA - timeB;
          }
        });
      }
    const totalPages = Math.ceil(totalCount / queryOptions.take);

    res.json({ fastestLaps, totalPages });
  } catch (error) {
    console.error("Error searching fastest laps:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
