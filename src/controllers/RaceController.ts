import { Request, Response } from "express";
import Race from "../models/Race";
import { getRepository, FindManyOptions, Like } from "typeorm";

export const searchRace = async (req: Request, res: Response) => {
  const { year, grandPrix, winner, car, page, limit, sortBy, sortOrder } =
    req.query;

  const raceRepository = getRepository(Race);

  try {
    const queryOptions: FindManyOptions<Race> = {
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

    if (winner) {
      queryOptions.where = {
        ...queryOptions.where,
        winner: Like(`%${winner}%`),
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
      }else if (sortBy === "laps") {
        queryOptions.order = { laps: order };
      }else if (sortBy === "time"){
        queryOptions.order = {};
      }
    }

    if (page) {
      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;
      queryOptions.skip = (pageNumber - 1) * limitNumber;
      queryOptions.take = limitNumber;
    }

    const [races, totalCount] = await raceRepository.findAndCount(queryOptions);
    if (sortBy === 'time' && sortOrder) {
        races.sort((a, b) => {
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

    res.json({ races, totalPages });
  } catch (error) {
    console.error("Error searching races:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
