import { QueryParams } from "../types/types";

export const createPath = (path: string, query?: QueryParams): string => {
  const formattedQuery = query
    ? Object.entries(query).reduce(
        (query, [key, value]) => ({ ...query, [key]: `${value}` }),
        {} as Record<string, string>
      )
    : undefined;
  return formattedQuery
    ? `${path}?${new URLSearchParams(formattedQuery).toString()}`
    : path;
};
