import {} from 'express'; //do not delete this - required for augmenting module declarations
declare global {
  namespace Express {
    export interface User {
      id: string;
      email: string;
      name: string;
    }
  }
}
