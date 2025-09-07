export interface Context {
  name: string;
  port: number;
}

export type Contexts = Record<string, Context>;

export interface Environment {
  contexts: Contexts;
  host: string;
  production: boolean;
}
