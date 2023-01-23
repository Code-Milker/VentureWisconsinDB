export enum USER_ROLE {
  "ADMIN" = "ADMIN",
  "USER" = "USER",
}

export enum ROUTES {
  MAIN_PAGE = "MainPage",
  ADMIN_PAGE = "AdminPage",
}

export interface IFactory<T, S extends string> {
  create: () => {};
  getByUnique: (identifier: string) => Promise<T>;
  getAll: (filter: any) => Promise<T[]>;
  update: (payload: Partial<T>) => Promise<T>;
  remove: (identifier: string) => Promise<number>;
  DBTests: () => Promise<void>;
}
