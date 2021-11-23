import { Router } from 'express';

interface Route {
  basePath?: string;
  path?: string;
  router: Router;
}

export default Route;
