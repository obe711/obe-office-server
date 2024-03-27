const express = require('express');
const ledController = require('../../controllers/led.controller');


const router = express.Router();

router.post('/color', ledController.changeColor);
router.post('/brightness', ledController.changeBrightness);

module.exports = router;