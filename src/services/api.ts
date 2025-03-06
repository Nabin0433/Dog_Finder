import { LocationsSearchType, LoginInput } from "../../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frontend-take-home-service.fetch.com";

export const login = async (data: LoginInput) => {
  return await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
};

export const logout = async () => {
  return await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const getAllBreedNames = async () => {
  const response = await fetch(`${API_URL}/dogs/breeds`, {
    method: 'GET',
    credentials: 'include',
  });
  return response;
};

export const searchDogs = async (query: any) => {
  const response = await fetch(`${API_URL}/dogs/search?${query}`, {
    method: 'GET',
    credentials: 'include',
  });
  return response;
};

export const postDogs = async (id: string[]) => {
  const response = await fetch(`${API_URL}/dogs`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
  return await response.json();
};

export const matchDogs = async (id: string[]) => {
  const response = await fetch(`${API_URL}/dogs/match`, {
    method: "POST",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(id),
  });
  return await response.json();
};

export const locationsSearch = async (data: LocationsSearchType[]) => {
  const response = await fetch(`${API_URL}/dogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  return await response.json();
};