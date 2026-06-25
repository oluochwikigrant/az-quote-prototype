export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/(.*)": ["admin"],
  "/new/(.*)": ["admin"],
  "/inbox/(.*)": ["admin"],
  "/profile(.*)": ["admin"],
};
