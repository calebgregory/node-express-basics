var express = require('express');
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();

router.get('/', function(req, res) {

  var collection = global.db.collection('pizzas');
  collection.find({}).toArray(function(err,orders){
    var formattedOrders = orders.map(function(order) {
      return {
        _id       : order._id,
        name      : order.name,
        toppings  : order.toppings.join(', '),
        complete  : order.complete,
        createdAt : moment(order._id.getTimestamp()).fromNow()
      };
    });
    res.render('templates/pizza-index',
              { orders : formattedOrders });
  });

});

router.get('/order', function(req,res) {
  res.render('templates/pizza-new');
});

router.post('/order', function(req,res) {

  var collection = global.db.collection('pizzas');
  var newOrder = {
    name      : req.body.name,
    toppings  : req.body.toppings,
    complete  : false
  };
  collection.save(newOrder, function() {
    res.redirect('/pizza');
  });

});

router.post('/order/:id/complete', function(req,res) {

  var collection = global.db.collection('pizzas');
  collection.update(
    { _id : ObjectID(req.params.id) },
    { $set : {complete:true} },
    function() {
      res.redirect('/pizza');
    }
  );

});

module.exports = router;
