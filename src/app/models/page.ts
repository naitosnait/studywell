export interface Page {
  id: number;
  name: string;
  description: string;
  founded: string;
  city: Item;
  country: Item;
  address: string;
  location: Location;
  language: FilterItem[];
  programs: Program[];
  subjects: FilterItem[];
  studytypes: FilterItem[];
  orgtypes: FilterItem[];
  events: FilterItem[];
  videos: Video[];
  images: Image[];
  contacts: Contacts;
  rating: number;
  base_url: string;
}

export interface Item {
  id: number;
  name: string;
}

export interface FilterItem {
  id: number;
  name: string;
  filter: boolean;
}

export interface CountItem {
  id: number;
  name: string;
  count: number;
}

export interface Contacts {
  site: string;
  email: string;
  tel: string;
}

export interface Image {
  image_id: number;
}

export interface Location {
  type: string;
  coordinates: number[];
}

export interface Program {
  id: number;
  name: string;
  date: Date[];
  age: number[];
  price: Price;
  living: Item;
  period: string;
}

export interface Price {
  original_price: number;
  original_currency: string;
  currency: number;
  calc_price: number;
  calc_currency: string;
  currency_c: number;
}

export interface Date {
  id: number;
  documents: string;
  startdate: string;
  enddate: string;
}

export interface Video {
  video_id: string;
  video_url: string;
}

export interface Query {
  id: number;
  query: string;
}

export interface PageInfo {
  id: string
  name: string
  description: string
  rating: number
  location: Location
  base_url: string
  minprice: number
  minage: number
}

export interface Catalog<T> {
  items: T[];
  total_items: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface Currency {
  original_currency: string
  currency: number
  count: number
}

export interface NewProgram {
  dateFrom: string;
  dateTo: string;
  ageFrom: number;
  ageTo: number;
  price: string;
  currency: Currency;
  calcprice: any;
  living: Item;
  period: string;
}
