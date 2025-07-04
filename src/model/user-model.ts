import { Role, User } from "@prisma/client";

export type userResponse = {
  username: string;
  email: string;
  role?: string;
  token?: string;
};

export type CreateUserRequest = {
  username: string;
  email: string;
  password: string;
  role?: Role;
};

export type LoginUserRequest = {
  email: string;
  password: string;
};

export function toUserResponse(user: User): userResponse {
  return {
    username: user.username || "",
    email: user.email,
    role: user.role,
  };
}
