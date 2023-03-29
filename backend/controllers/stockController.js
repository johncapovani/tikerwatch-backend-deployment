const asyncHandler = require('express-async-handler');
const Stock = require('../models/stockModel');
const { calculateMetrics } = require('./scripts/stockMetricCall');
const { getNewsArticlesForAllStocks } = require('./scripts/stockNewsCall');

// @desc Get all stocks
// @route GET /api/stocks
// @access Private
exports.getStocks = asyncHandler(async (req, res) => {
  const stocks = await Stock.find({ user: req.user._id });
  res.json(stocks);
});

// @desc Get a specific stock by symbol
// @route GET /api/stocks/:symbol
// @access Private
exports.getStockBySymbol = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const stock = await Stock.findOne({ symbol });
  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }
  res.json(stock);
});

// @desc Add a new stock
// @route POST /api/stocks
// @access Private
exports.addStock = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { symbol, name, sector } = req.body;

  if (!symbol || !name || !sector) {
    res.status(400);
    throw new Error('Please provide symbol, name, and sector');
  }

  const stock = await Stock.create({ symbol, name, sector, user: _id });

  res.status(201).json(stock);
});

// @desc Update a stock by symbol
// @route PUT /api/stocks/:symbol
// @access Private
exports.updateStockBySymbol = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const { name, sector } = req.body;

  const stock = await Stock.findOneAndUpdate({ symbol }, { name, sector }, { new: true });

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }

  res.json(stock);
});

// @desc Delete a stock by symbol
// @route DELETE /api/stocks/:symbol
// @access Private
exports.deleteStockBySymbol = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  const stock = await Stock.findOneAndDelete({ symbol });

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }

  res.json(stock);
});

// @desc Get 8 pillar metrics for a stock by symbol
// @route GET /api/stocks/:symbol/metrics
// @access Private
exports.getStockMetrics = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  // Fetch the stock data and calculate the 8 pillar metrics
  const metrics = await calculateMetrics(symbol);
  // Send the metrics back to the client
  res.json(metrics);
});

// @desc Calculate target price for a stock by symbol
// @route GET /api/stocks/:symbol/target-price
// @access Private
exports.getStockTargetPrice = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  // Fetch the stock data and calculate the target price
  // ...
  res.json({ targetPrice });
});

// @desc Get news articles for all user's stocks
// @route GET /api/stocks/news
// @access Private
exports.getStockNews = asyncHandler(async (req, res) => {
  console.log('Triggered')
  const newsArticles = await getNewsArticlesForAllStocks(req.user._id);
  res.json(newsArticles);
});