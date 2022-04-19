import { CronSchedule, QuoteCurrency } from "./enums";

export interface Coin {
  ticker: string;
  currency: QuoteCurrency;
  quoteQuantity?: number;
  coinSchedule?: CronSchedule;
}

export interface IConfig {
  binance_key?: string;
  binance_secret?: string;
  binanceApiUrl?: string;
  schedule: CronSchedule;
  coins: Coin[];
}

export interface QueryParams {
  side: string;
  isIsolated: boolean;
  type: string;
  symbol: string;
  signature?: string;
  quoteOrderQty?: number;
  sideEffectType?: string;
  recvWindow?: number;
  timestamp?: Date | number;
}
