import { CronSchedule, QuoteCurrency } from "./types/enums";
import { IConfig } from "./types/types";

export const Config: IConfig = {
  binance_key: process.env.BINANCE_KEY,
  binance_secret: process.env.BINANCE_SECRET,
  binanceApiUrl: process.env.BINANCE_API_URL,
  schedule: CronSchedule.EVERY_15_MIN,
  coins: [
    {
      ticker: "BTC", // Asset you want to buy
      currency: QuoteCurrency.USDT, // Currency you want to buy the asset with
      quoteQuantity: 20, // Buy X USDT worth of BTC, bypassing the min 10 USD/EUR/GBP min transaction in app.js
      coinSchedule: CronSchedule.EVERY_5_MIN, // How often to buy the asset - optional
    },
  ],
};
