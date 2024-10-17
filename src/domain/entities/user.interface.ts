export interface User {
  id: string;
  username: string;
  role: string;
}

export interface UserResponse {
  username: string;
  access_token?: string;
}

export interface UserJwtPayload {
  userId: string;
  username: string;
  role: string;
}

export interface UserRequest {
  user: UserJwtPayload;
}
