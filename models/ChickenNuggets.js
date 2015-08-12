var ObjectID = require('mongodb').ObjectID
  , _ = require('lodash');

function Order(o) {
  this._id       = o._id;
  this.name      = o.name;
  this.flavor    = o.style;
  this.qty       = o.qty;
  this.complete  = o.complete || false;
}

Object.defineProperty(Order, 'collection', {
  get: function() {
    return global.db.collection('chickenNuggets')
  }
});

Order.prototype.save = function(cb) {
  Order.collection.save(this,cb);
};

Order.prototype.setIsComplete = function(cb) {
  console.log(this);
  Order.collection.update(
    { _id : this._id },
    { $set : {'complete':true} },
    cb);
};

Order.findById = function(id,cb) {
  Order.collection.findOne(
    { _id : ObjectID(id) },
    function(err,order) {
      cb(err, setPrototype(order));
    });
};

Order.findAll = function(cb) {
  Order.collection.find({}).toArray(
    function(err, orders) {
      var prototypedOrders = orders.map(function(order) {
        return setPrototype(order);
      });
      cb(err, prototypedOrders);
    });
};

module.exports = Order;

function setPrototype(pojo) {
  return _.create(Order.prototype, pojo);
}
