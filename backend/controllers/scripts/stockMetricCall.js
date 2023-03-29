const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.ALPHA_ADVANTAGE_KEY;

async function getStockData(symbol) {
  const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`);
  const data = response.data;
  return data;
}

async function calculateMetrics(symbol) {
  const stockData = await getStockData(symbol);

  const currentPrice = parseFloat(stockData["PriceToSalesRatioTTM"]);
  const eps = parseFloat(stockData["EPS"]);
  const roe = parseFloat(stockData["ReturnOnEquityTTM"]);
  const netMargin = parseFloat(stockData["ProfitMargin"]);
  const dte = parseFloat(stockData["DividendYield"]);
  const debtToEquity = parseFloat(stockData["DebtEquityRatio"]);
  const currentRatio = parseFloat(stockData["CurrentRatio"]);
  const pbr = parseFloat(stockData["PriceToBookRatio"]);

  const gradePriceToSales = currentPrice < 1 ? 'Excellent' : currentPrice < 5 ? 'Good' : 'Bad';
  const gradeEPS = eps > 0 ? eps > 1 ? 'Excellent' : 'Good' : 'Bad';
  const gradeROE = roe > 20 ? 'Excellent' : roe > 10 ? 'Good' : 'Bad';
  const gradeNetMargin = netMargin > 20 ? 'Excellent' : netMargin > 10 ? 'Good' : 'Bad';
  const gradeDTE = dte > 3 ? 'Excellent' : dte > 1 ? 'Good' : 'Bad';
  const gradeDebtToEquity = debtToEquity < 1 ? 'Excellent' : debtToEquity < 2 ? 'Good' : 'Bad';
  const gradeCurrentRatio = currentRatio > 2 ? 'Excellent' : currentRatio > 1 ? 'Good' : 'Bad';
  const gradePBR = pbr < 1 ? 'Excellent' : pbr < 4 ? 'Good' : 'Bad';

  const metrics = {
    info: {
      Symbol: stockData["Symbol"],
      AssetType: stockData["AssetType"],
      Name: stockData["Name"],
      Description: stockData["Description"],
      Exchange: stockData["Exchange"],
      Country: stockData["Country"],
      Sector: stockData["Sector"],
      Industry: stockData["Industry"],
      MarketCapitalization: stockData["MarketCapitalization"],
      EBITDA: stockData["EBITDA"],
      PERatio: stockData["PERatio"],
      PEGRatio: stockData["PEGRatio"],
      BookValue: stockData["BookValue"],
      DividendPerShare: stockData["DividendPerShare"],
      DividendYield: stockData["DividendYield"],
      EPS: stockData["EPS"],
      RevenuePerShareTTM: stockData["RevenuePerShareTTM"],
      ProfitMargin: stockData["ProfitMargin"],
      OperatingMarginTTM: stockData["OperatingMarginTTM"],
      ReturnOnAssetsTTM: stockData["ReturnOnAssetsTTM"],
      ReturnOnEquityTTM: stockData["ReturnOnEquityTTM"],
      RevenueTTM: stockData["RevenueTTM"],
      GrossProfitTTM: stockData["GrossProfitTTM"],
      DilutedEPSTTM: stockData["DilutedEPSTTM"],
      QuarterlyEarningsGrowthYOY: stockData["QuarterlyEarningsGrowthYOY"],
      QuarterlyRevenueGrowthYOY: stockData["QuarterlyRevenueGrowthYOY"],
      AnalystTargetPrice: stockData["AnalystTargetPrice"],
      TrailingPE: stockData["TrailingPE"],
      ForwardPE: stockData["ForwardPE"],
      PriceToSalesRatioTTM: stockData["PriceToSalesRatioTTM"],
      PriceToBookRatio: stockData["PriceToBookRatio"],
      EVToRevenue: stockData["EVToRevenue"],
      EVToEBITDA: stockData["EVToEBITDA"],
      Beta: stockData["Beta"],
      '52WeekHigh': stockData["52WeekHigh"],
      '52WeekLow': stockData["52WeekLow"],
      '50DayMovingAverage': stockData["50DayMovingAverage"],
      '200DayMovingAverage': stockData["200DayMovingAverage"],
      SharesOutstanding: stockData["SharesOutstanding"],
      DividendDate: stockData["DividendDate"],
      ExDividendDate: stockData["ExDividendDate"]
    },
    priceToSalesRatio: {
      value: currentPrice.toFixed(2),
      grade: gradePriceToSales
    },
    earningsPerShare: {
      value: eps.toFixed(2),
      grade: gradeEPS
    },
    returnOnEquity: {
      value: roe.toFixed(2),
      grade: gradeROE
    },
    netProfitMargin: {
      value: netMargin.toFixed(2),
      grade: gradeNetMargin
    },
    dividendYield: {
      value: dte.toFixed(2),
      grade: gradeDTE
    },
    debtToEquityRatio: {
      value: debtToEquity.toFixed(2),
      grade: gradeDebtToEquity
    },
    currentRatio: {
      value: currentRatio.toFixed(2),
      grade: gradeCurrentRatio
    },
    priceToBookRatio: {
      value: pbr.toFixed(2),
      grade: gradePBR
    }
  };

  return metrics;
}

module.exports = { calculateMetrics };
