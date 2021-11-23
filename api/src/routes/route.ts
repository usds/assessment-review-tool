import { Router } from 'express';
import Route from '../interfaces/routes.interface';

export abstract class BaseRouter implements Route {
  router = Router();

  private _path = '/';
  private _basePath = '/api';

  set path(path: string) {
    this._path = path;
  }
  get path() {
    return this._path;
  }
  set basePath(path: string) {
    this._basePath = path;
  }
  get basePath() {
    return this._basePath || '/';
  }
  get fullBasePath() {
    return `${this._basePath}${this._path}`;
  }
}
