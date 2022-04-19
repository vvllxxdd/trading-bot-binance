export enum QuoteCurrency {
  USDT = "USDT",
  BTC = "BTC",
  BUSD = "BUSD",
  ETH = "ETH",
}

export enum CronSchedule {
  EVERY_MINUTE = "* * * * *", // Every minute
  EVERY_5_MIN = "*/5 * * * *", // Every 5 minutes
  EVERY_15_MIN = "*/15 * * * *", // Every 15 minutes
  HOURLY = "0 */1 * * *", // Every hour
  EVERY_4_HRS = "0 */4 * * *", // Every 4 hours
  EVERY_8_HRS = "0 */8 * * *", // Every 8 hours
  EVERY_12_HRS = "0 */12 * * *", // Every 12 hours
  DAILY = "0 12 * * *", // Daily 12:00.
  WEEKLY = "0 12 * * 0", // At 12:00 on Sunday
}

export const enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
}

export const enum SideEffectType {
  NO_SIDE_EFFECT = "NO_SIDE_EFFECT",
  MARGIN_BUY = "MARGIN_BUY",
  AUTO_REPAY = "AUTO_REPAY",
}

export const enum OrderStatus {
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  FILLED = "FILLED",
  NEW = "NEW",
  PARTIALLY_FILLED = "PARTIALLY_FILLED",
  PENDING_CANCEL = "PENDING_CANCEL",
  REJECTED = "REJECTED",
}
