import { Page } from "app/models/page";
import { Org } from "./org";

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
