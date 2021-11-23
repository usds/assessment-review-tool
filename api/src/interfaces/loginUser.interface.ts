export interface LoginUserDetails extends Express.User {
  email: string;
  // sub: string;
  // iss?: string;
  // id_token: string;
  // state: string;
  id: string;
  hasUser?: boolean;
}
