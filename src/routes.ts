import { Router } from 'express';
import { searchDrivers } from './controllers/DriverController';
import { searchRace } from './controllers/RaceController';
import { searchFastestLap } from './controllers/FastestLapController';
import { searchTeam } from './controllers/TeamController';

const routes = Router();

routes.get('/api/', (req, res) => {
  return res.json({ message: 'F1 formula api by nguyendat' });
});
routes.get('/api/drivers', searchDrivers);
routes.get('/api/races', searchRace);
routes.get('/api/teams', searchTeam);
routes.get('/api/fastest-laps', searchFastestLap);
export default routes;