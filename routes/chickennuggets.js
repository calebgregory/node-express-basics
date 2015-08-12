var express = require('express');
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;
var path = require('path');

var Order = require(path.join(process.cwd(),
                            '/models/ChickenNuggets'));
var router = express.Router();

router.get('/', function(req,res) {

  Order.findAll(function(err,orders) {
    res.render('templates/chicken-index',
              { orders : formatAll(orders) });
  });

  function formatAll(orders) {

    return orders.map(function(order) {
      order.flavor = order.style;
      order.createdAt = moment(order._id.getTimestamp()).fromNow();
      delete order.style;
      return order;
    });

  }

});

router.get('/order', function(req,res) {
  res.render('templates/chicken-new');
});

router.post('/order', function(req,res) {

  var order = new Order(req.body);

  order.save(function() {
    res.redirect('/chickennuggets');
  });

//  var collection = global.db.collection('chickenNuggets');
//  var newOrder = {
//    name      : req.body.name,
//    style     : req.body.style,
//    qty       : req.body.qty,
//    complete  : false
//  };

});

router.post('/order/:id/complete', function(req,res) {

  var order = Order.findById(req.params.id,
    function(err,order) {
      order.setIsComplete(function() {
        res.redirect('/chickennuggets');
      });
  });

});

module.exports = router;
