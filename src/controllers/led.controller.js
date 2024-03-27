const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { mesApi } = require("../aedes.server");


const changeColor = catchAsync(async (req, res) => {
  mesApi.portalApi.portalSetColor(req.body.color)
  res.status(httpStatus.NO_CONTENT).send();
});

const changeBrightness = catchAsync(async (req, res) => {
  mesApi.portalApi.portalSetBrightness(req.body.brightness)
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  changeColor,
  changeBrightness
}