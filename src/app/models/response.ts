import { Page } from "app/models/page";
import { Org } from "./org";
import { User } from "./user";
import { ExistArticle } from "./article";

export interface PageResponse {
  status: string;
  page: Page;
}

export interface LoginResponse {
  status: string;
  access_token: string;
}

export interface OrgResponse {
  status: string
  orgs: Org[]
  c_orgs: number
  page: number
  size: number
  pages: number
}

export interface UserResponse {
  status: string
  users: User[]
  c_users: number
  page: number
  size: number
  pages: number
}

export interface ArticleResponse {
  status: string
  article: ExistArticle[]
}
