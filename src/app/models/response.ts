import { Page } from "app/models/page";
import { Org } from "./org";
import { User } from "./user";
import { ExistArticle } from "./article";
import { ExistSuperUser } from "./admin";
import { Comment } from "./comment";

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
  c_articles: number
  page: number
  size: number
  pages: number
}

export interface ModeratorsListResponse {
  status: string;
  moderators: ExistSuperUser[];
}

export interface ProfileResponse {
  status: string;
  moderator: ExistSuperUser;
}

export interface CommentResponse{
    comments: Comment[]
    c_comments: number
    page: number
    size: number
    pages: number
}


