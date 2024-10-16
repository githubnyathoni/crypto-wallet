export interface User {
  id: string;
  username: string;
  role: string;
}

export interface UserResponse {
  username: string;
  access_token?: string;
}
