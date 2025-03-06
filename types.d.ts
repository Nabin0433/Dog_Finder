export interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Match {
  match: string;
}

export interface LoginInput {
  email: string;
  name: string;
}

export interface LocationsSearchType {
  city?: string,
  states?: string[],
  geoBoundingBox?: {
    top?: number,
    left?: number,
    bottom?: number,
    right?: number,
    bottom_left?: Coordinates,
    top_left?: Coordinates
  },
  size?: number,
  from?: number
}

