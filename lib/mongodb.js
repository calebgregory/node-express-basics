var mongo = require('mongodb').MongoClient;

if(!global.db) {
  var url = 'mongodb://localhost:27017/express_basics';
  mongo.connect(url,function(err,db) {
    global.db = db;
  });
}
