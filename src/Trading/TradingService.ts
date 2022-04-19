import crypto from "crypto";
import { Coin, QueryParams } from "../types/types";
import { stringify } from "querystring";
import { Config } from "../config";
import { fetchWrapper, RequestMethod } from "../helpers/fetchWrapper";
import {
  OrderSide,
  OrderType,
  QuoteCurrency,
  SideEffectType,
} from "../types/enums";
import { createPath } from "../helpers/createPath";
import { CandleChartInterval, Order, OrderStatus } from "binance-api-node";
import Binance from "binance-api-node";

const binanceClient = Binance({});

export class TradingService {
  private readonly config = Config;
  private readonly apiKey = this.config.binance_key;
  private readonly apiSecret = this.config.binance_secret;
  private readonly apiUrl = this.config.binanceApiUrl;
  private binanceClient = Binance({
    apiKey: this.apiKey,
    apiSecret: this.apiSecret,
  });

  createSignature(params: QueryParams | undefined) {
    return crypto
      .createHmac("sha256", this.apiSecret!)
      .update(stringify(params as unknown as Record<any, any>))
      .digest("hex");
  }

  async marketBuy(
    pair: string,
    quoteQuantity?: number,
    sideEffectType?: string,
    type = OrderType.MARKET
  ): Promise<Order> {
    const queryParams: QueryParams = {
      symbol: pair,
      side: OrderSide.BUY,
      type,
      quoteQuantity,
      recvWindow: 30000,
      sideEffectType,
      timestamp: Date.now(),
    };

    queryParams.signature = this.createSignature(queryParams);

    try {
      const response = await fetchWrapper(
        createPath(`${this.apiUrl}/sapi/v1/margin/order`, queryParams),
        { method: RequestMethod.POST }
      );

      return response as Order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async marketSell(
    pair: any,
    quoteQuantity: number,
    sideEffectType = SideEffectType.AUTO_REPAY,
    type = OrderType.MARKET
  ): Promise<Order> {
    const queryParams: QueryParams = {
      symbol: pair,
      side: OrderSide.SELL,
      type,
      quoteQuantity,
      recvWindow: 30000,
      sideEffectType,
      timestamp: Date.now(),
    };

    queryParams.signature = this.createSignature(queryParams);

    try {
      const response = await fetchWrapper(
        createPath(`${this.apiUrl}/sapi/v1/margin/order`, queryParams),
        { method: RequestMethod.POST }
      );

      return response as Order;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPriceChangePercent({
    ticker,
    quote,
    interval = CandleChartInterval.FIFTEEN_MINUTES,
  }: {
    ticker: string;
    quote: QuoteCurrency;
    interval?: CandleChartInterval;
  }): Promise<number> {
    const { open, close } = await binanceClient
      .candles({
        symbol: `${ticker}${quote}`,
        interval,
      })
      .then((res) => res[0]);

    return this.calculatePriceChangePercent(open, close);
  }

  async placeOrder(coin: Coin) {
    let { ticker, currency, quoteQuantity } = coin;
    let quantity =
      !quoteQuantity || quoteQuantity < 10.01 ? 10.01 : quoteQuantity;
    const pair = `${ticker}${currency}`;

    const priceChangePercent = await this.getPriceChangePercent({
      ticker,
      quote: currency,
    });

    const hasNegativePriceChange = priceChangePercent < 0;

    console.log(
      `Price for ${ticker} changed ${priceChangePercent}% in the last selected candle.`
    );

    const adjustedQuantity =
      quantity * (1 + Math.abs(priceChangePercent) / 100);

    const response = hasNegativePriceChange
      ? await this.marketBuy(pair, adjustedQuantity)
      : await this.marketSell(pair, adjustedQuantity);

    if (
      response &&
      response.status === OrderStatus.FILLED &&
      response.orderId
    ) {
      console.log(
        `Successfully purchased: ${
          response.executedQty
        } ${currency} worth of ${ticker} @ ${response.fills?.shift()?.price}\n`
      );
    } else {
      console.error(`Unexpected error placing buy order for ${pair}`);
    }
  }

  private calculatePriceChangePercent(open: string, close: string): number {
    return 100 - (parseFloat(close) * 100) / parseFloat(open);
  }
}
