import { Request, Response } from 'express';
import Team from '../models/Team';
import { getRepository, FindManyOptions, Like } from 'typeorm';
export const searchTeam = async (req: Request, res: Response) => {
    const { year, position, name, page, limit, sortBy, sortOrder } = req.query;
  
    const teamRepository = getRepository(Team);
  
    try {
      const queryOptions: FindManyOptions<Team> = {
        where: {},
        order: {},
        skip: 0,
        take: 10,
      };
      if (year) {
        queryOptions.where = { ...queryOptions.where, year: String(year) };
      }
      if (position) {
        queryOptions.where = { ...queryOptions.where, position: String(position) };
      }
      if (name) {
        queryOptions.where = { ...queryOptions.where, name: Like(`%${name}%`) };
      }
      if (sortBy) {
        const order: 'ASC' | 'DESC' = sortOrder === 'desc' ? 'DESC' : 'ASC';
        if (sortBy === 'year') {
          queryOptions.order = { year: order };
        } else if (sortBy === 'position') {
          queryOptions.order = { position: order };
        } else if (sortBy === 'points') {
          queryOptions.order = { points: order };
        }
      }
      if (page) {
        const pageNumber = parseInt(page as string, 10) || 1;
        const limitNumber = parseInt(limit as string, 10) || 10;
        queryOptions.skip = (pageNumber - 1) * limitNumber;
        queryOptions.take = limitNumber;
      }
      const [teams, totalCount] = await teamRepository.findAndCount(queryOptions);
      const totalPages = Math.ceil(totalCount / queryOptions.take);
      res.json({ teams, totalPages });
    } catch (error) {
      console.error('Error searching teams:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };