export function highPrice(asset) {
  let max = Math.max(...asset.prices);
  return max ? max : 0;
}

export function lastChangePct(asset) {
  if (asset.dataload.lastPrice && asset.prices.length > 0)
    return asset.dataload.lastPrice / asset.prices[asset.prices.length - 1] - 1;
  return null;
}

export function income(asset) {
  let sum = 0;
  for (let date in asset._payouts)
    sum += parseFloat(asset._payouts[date].value);
  return sum;
}

export function holdingPeriod(asset) {
  let diff = null;
  if (!isSold(asset)) diff = new Date() - firstTrxDate(asset);
  else diff = lastTrxDate(asset) - firstTrxDate(asset);
  return parseInt(diff / (1000 * 60 * 60 * 24), 10);
}

export function roi(asset) {
  // calculate the annualized return on investment
  if (asset.holdingPeriod(asset) > 365) {
    return (
      (Math.pow(
        1 + nominalReturn(asset) / totalBuyValue(asset),
        1 / (holdingPeriod(asset) / 365)
      ) -
        1) *
      100
    );
  }
  // any investment that does not have a track record of at least 365 days cannot "ratchet up" its performance to be annualized
  // https://www.investopedia.com/terms/a/annualized--return.asp
  else return (nominalReturn(asset) / totalBuyValue(asset)) * 100;
}

export function totalSharesBought(asset) {
  const count = buys(asset).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
  return count;
}

export function totalSharesSold(asset) {
  const count = sells(asset).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
  return count;
}

export function isSold(asset) {
  if (totalSharesSold(asset) === totalSharesBought(asset)) return true;
  else return false;
}

export function firstTrxDate(asset) {
  const dates = asset.trxns.map((trx) => trx.date);
  return dates.length > 0 ? new Date(dates.sort()[0]) : null;
}

export function lastTrxDate(asset) {
  const dates = asset.trxns.map((trx) => trx.date);
  return dates.length > 0 ? new Date(dates.sort()[dates.length - 1]) : null;
}

export function buys(asset) {
  return asset.trxns.filter((trx) => trx.type === "Buy");
}

export function sells(asset) {
  return asset.trxns.filter((trx) => trx.type === "Sell");
}

export function payouts(asset) {
  return asset.trxns.filter((trx) => trx.type === "Payout");
}

export function buyDates(asset) {
  return buys(asset).map((trx) => trx.date);
}

export function sellDates(asset) {
  return sells(asset).map((trx) => trx.date);
}

export function avgBuyPrice(asset) {
  let sum = 0;
  for (const trx of buys(asset)) {
    sum += trx.price * trx.amount;
  }
  return sum === 0 ? null : sum / totalSharesBought(asset);
}

export function totalBuyValue(asset) {
  const value = buys(asset).reduce((acc, cur) => {
    return acc + cur.value;
  }, 0);
  return value;
}

export function totalSellValue(asset) {
  const value = sells(asset).reduce((acc, cur) => {
    return acc + cur.value;
  }, 0);
  return value;
}

export function change(asset) {
  if (isSold(asset)) return 0;
  if (asset.dataload.lastPrice)
    return (
      (asset.dataload.lastPrice / avgBuyPrice(asset)) * totalBuyValue(asset) -
      totalBuyValue(asset)
    );
  return 0;
}

export function nominalReturn(asset) {
  if (isSold(asset)) return totalSellValue(asset) - totalBuyValue(asset);
  else return 0;
}

export function totalPayoutValue(asset) {
  const value = payouts(asset).reduce((acc, cur) => {
    return acc + cur.value;
  }, 0);
  return value;
}
