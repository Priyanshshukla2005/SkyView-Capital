const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const mlValidation = require('../../validations/ml.validation');
const mlController = require('../../controllers/ml.controller')
const router = express.Router();

router
  .route('/')
  // ML endpoints are intentionally left unauthenticated in dev so they work
  // even when the DB/auth service is unavailable.
  .post(mlController.getUserInput)
  // .post(auth('manageUsers'), validate(mlValidation.getUserInput), mlController.getPrediction)

router
  .route('/search')
  .post(mlController.getSearch)

module.exports = router;