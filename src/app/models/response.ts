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
}

export interface UserResponse {
  status: string
  users: User[]
}

export interface ArticleResponse {
  status: string
  article: ExistArticle[]
}