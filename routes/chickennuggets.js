var express = require('express');
var moment = require('moment');
var ObjectID = require('mongodb').ObjectID;

var router = express.Router();

router.get('/', function(req,res) {

  var collection = global.db.collection('chickenNuggets');
  collection.find({}).toArray(function(err,orders) {
    var formattedOrders = orders.map(function(order) {
      return {
        _id       : order._id,
        name      : order.name,
        flavor    : order.style,
        qty       : order.qty,
        complete  : order.complete,
        createdAt : moment(order._id.getTimestamp()).fromNow()
      };
    });
    res.render('templates/chicken-index',
              { orders : formattedOrders });
  });

});

router.get('/order', function(req,res) {
  res.render('templates/chicken-new');
});

router.post('/order', function(req,res) {

  var collection = global.db.collection('chickenNuggets');
  var newOrder = {
    name      : req.body.name,
    style     : req.body.style,
    qty       : req.body.qty,
    complete  : false
  };
  collection.save(newOrder,function() {
    res.redirect('/chickennuggets');
  });

});

router.post('/order/:id/complete', function(req,res) {

  var collection = global.db.collection('chickenNuggets');
  collection.update(
    { _id  : ObjectID(req.params.id) },
    { $set : {complete:true} },
    function() {
      res.redirect('/chickennuggets');
    }
  );

});

module.exports = router;
