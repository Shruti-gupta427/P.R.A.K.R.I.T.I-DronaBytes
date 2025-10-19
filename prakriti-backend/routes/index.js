var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ 
    message: 'PRAKRITI Backend API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
