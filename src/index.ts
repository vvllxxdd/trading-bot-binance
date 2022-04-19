import * as cron from "node-schedule";
import { Config } from "./config";
import { Coin } from "./types/types";
import { TradingService } from "./Trading/TradingService";

async function bootstrap() {
  console.log(
    `---Starting DCA Bot on Binance: ${new Date().toLocaleString()}---`
  );

  const { coins, schedule: globalSchedule } = Config;

  for (const coin of coins) {
    const { ticker, coinSchedule } = coin;
    const schedule = coinSchedule || globalSchedule;

    if (!coin || !schedule) {
      console.error(
        `Error: Sufficient params have not been provided for ${ticker}`
      );
      continue;
    }

    try {
      const tradingService = new TradingService();
      cron.scheduleJob(
        schedule,
        async () => await tradingService.placeOrder(coin)
      );
    } catch (e) {
      console.error(e);
    }
  }
}

bootstrap();
