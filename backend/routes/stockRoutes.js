const express = require('express');
const router = express.Router();

// Add route protection
const { protect } = require('../middleware/authMiddleware');

// Bring in the stock controller functions
const {
  getStocks,
  getStockBySymbol,
  addStock,
  updateStockBySymbol,
  deleteStockBySymbol,
  getStockMetrics,
  getStockTargetPrice,
  getStockNews
} = require('../controllers/stockController');

// Get all stocks
router.get('/', protect, getStocks);

// Get a specific stock by symbol
router.get('/:symbol', protect, getStockBySymbol);

// Add a new stock
router.post('/', protect, addStock);

// Update a stock by symbol
router.put('/:symbol', protect, updateStockBySymbol);

// Delete a stock by symbol
router.delete('/:symbol', protect, deleteStockBySymbol);

// Get 8 pillar metrics for a stock by symbol
router.get('/:symbol/metrics', protect, getStockMetrics);

// Calculate target price for a stock by symbol
//Not a priority 
router.get('/:symbol/target-price', protect, getStockTargetPrice);

//Get News Articles
router.get('/news', protect, getStockNews);

module.exports = router;
