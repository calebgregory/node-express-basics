var fs = require('fs');
var router = require('express').Router();
var imgur = require('imgur');
imgur.setClientId(process.env.CLIENT_ID);

var multer = require('multer');
var upload = multer({
  dest       : 'uploads/',
  limits     : {
    fileSize : 200 * 1000 * 1000 // a btye*1000 = kilobyte, a kilobye*1000 = megabyte
  },
  fileFilter : function(req,file,cb) {
    cb(null,file.mimetype.slice(0,6) === 'image/');
  },
  filename   : 'test.jpg'
});

router.get('/', function(req,res) {
  var collection = global.db.collection('imgur');
  collection.find({}).toArray(function(err,pictures){
    var formattedPictures = pictures.map(function(picture) {
      return {
        _id : picture._id,
        url : picture.url
      };
    });
    res.render('templates/imgur-lib',
              { pictures : formattedPictures });
  });

});

router.get('/new', function(req,res) {
  res.render('templates/imgur-new');
});

router.post('/upload', upload.single('image'), function(req,res) {
  if(req.file) {
    imgur
      .uploadFile(req.file.path)
      .then(function(json) {
        fs.unlink(req.file.path, function() {
          var collection = global.db.collection('imgur');
          collection.insert({ url : json.data.link },
                           function() {
                             res.redirect('/imgur');
                           }
         );
        });
      })
      .catch(function(err) {
        res.send(err);
      });
  } else {
    res.status(415).send('must upload an image');
  }
});


module.exports = router;
