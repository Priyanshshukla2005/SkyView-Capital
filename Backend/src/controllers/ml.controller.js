const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const request = require('request');

function normalizeMlError(body, statusCode) {
  if (body && typeof body === 'object') {
    return { statusCode, ...body };
  }
  if (typeof body === 'string' && body.trim()) {
    return { statusCode, error: body };
  }
  return { statusCode, error: 'ML service error' };
}

const getPrediction = catchAsync(async (req, res) => {
  console.log(req.body);
  console.log(req.headers.authorization);
  // const data=req.body;
});

const getSearch = catchAsync(async (req, res) => {
  const data = req.body;
  console.log(data);
  const options = {
    url: 'http://localhost:6969/search',
    json: true,
    body: {
      company: data.company,
    },
    headers: {
      Token: `${process.env.SERVER_SECRET}`, // You can add more headers as needed
    },
  };

  var predictions;

  request.post(options, async (err, response, body) => {
    // console.log(res)
    if (err) {
      console.log(err);
      return res.status(502).json({ error: 'ML service unreachable' });
    }
    console.log(`Status: ${response.statusCode}`);
    if (response.statusCode == 200) {
      console.log('bla-bla');
      predictions = body;
      console.log(predictions);
      res.status(200).json(predictions);
      return;
    }
    return res.status(502).json(normalizeMlError(body, response.statusCode));
  });
});

const getUserInput = catchAsync(async (req, res) => {
  const data = req.body;
  console.log(data);
  const options = {
    url: 'http://localhost:6969/model',
    json: true,
    body: {
      company: data.company,
      endDate: data.endDate,
      startDate: data.startDate,
      days: data.days 
    },
    headers: {
      Token: `${process.env.SERVER_SECRET}`, // You can add more headers as needed
    },
  };

  var predictions;

  request.post(options, async (err, response, body) => {
    // console.log(res)
    if (err) {
      console.log(err);
      return res.status(502).json({ error: 'ML service unreachable' });
    }
    console.log(`Status: ${response.statusCode}`);
    if (response.statusCode == 200) {
      console.log('bla-bla');
      predictions = body;
      console.log(predictions);
      res.status(200).json(predictions);
      return;
    }
    return res.status(502).json(normalizeMlError(body, response.statusCode));
  });
  
});

module.exports = {
  getPrediction,
  getUserInput,
  getSearch
};
