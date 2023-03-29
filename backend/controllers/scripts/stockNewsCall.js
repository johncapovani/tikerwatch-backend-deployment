const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.ALPHA_ADVANTAGE_KEY;
const Stock = require('../../models/stockModel')

//Function to return news articles
async function getNewsArticles(symbol) {
  const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&symbol=${symbol}&apikey=${apiKey}`);
  const data = response.data;
  return data;
}

async function searchNewsArticlesForUser(userId) {
  console.log('Triggered')

  //Use lean to change the response data from mongoose to JavaScript plain objects
  const stocks = await Stock.find({ user: userId }).lean();

  const newsArticlesBySymbol = {};

  for (const stock of stocks) {
    const symbol = stock.symbol;
    const newsArticles = await getNewsArticles(symbol);
    newsArticlesBySymbol[symbol] = newsArticles;
  }

  return newsArticlesBySymbol;
}

module.exports = { searchNewsArticlesForUser };
