'use strict';

require('dotenv').config();
const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const multer = require("multer");
const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURI, (err, db) => {
      if (err) {
        reject(err)
      }
      resolve(db)
    })

  })
};

router.get('/categories', (req, res) => {
  const categories = [];
  let total = 0;
  let category = {
    _id: "All",
    num: 9999
  };
  categories.push(category);

  connectToDatabase()
    .then((db) => {
      db.collection('item')
        .aggregate([
          { $group: { _id: '$category', num: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]).toArray((err, docs) => {
          if (err) {
            return res.status(500).send(`Error: ${err}`);
          }

          docs.forEach((item) => {
            const itemCat = Object.assign({}, category);
            itemCat._id = item._id;
            itemCat.num = item.num;
            total += item.num;
            categories.push(itemCat);
          });

          categories[0].num = total;
          res.json(categories);
        })
    })
    .catch((err) => {
      res.status(500).send(`Error connecting to database: ${err}`);
    });
});

router.get('/getitems', (req, res) => {
  let category = req.query.category || 'All';
  let page = req.query.page ? Number(req.query.page) : 0;
  let limit = req.query.limit ? Number(req.query.limit) : 5;
  let skip = page * limit;

  connectToDatabase()
    .then((db) => {

      const findCondition = (category.toLowerCase() === 'all') ? {} : { category: category };
        db.collection('item').find(findCondition).skip(skip).limit(limit).sort({ _id: 1 })
          .toArray((err, docs) => {
            if (err) {
              return res.status(500).send(`Error: ${err}`);
            }

            res.json(docs);
          })
    })
    .catch((err) => {
      res.status(500).send(`Error connecting to database: ${err}`);
    });
});

router.get('/getnumitems', (req, res) => {
  const category = req.query.currentCategory || 'All';
  const findCondition = (category.toLowerCase() === 'all') ? {} : { category: category };

  connectToDatabase()
    .then((db) => {
      db.collection('item').find(findCondition).toArray((err, docs) => {
        if (err) {
          return res.status(500).send(`Error: ${err}`);
        }

        res.json({ count: docs.length });
      });
    })
    .catch((err) => {
      res.status(500).send(`Error connecting to database: ${err}`);
    });

});

router.get('/getitem/:id', (req, res) => {
  const itemId = parseInt(req.params.id);

  connectToDatabase()
    .then((db) => {
      db.collection('item').findOne({ _id: itemId }, (err, doc) => {
        if (err) {
          return res.status(500).send(`Error: ${err}`);
        }

        /* EXCEPTION: document not found */
        if (doc === null) {
          return res.status(404).send('Item not found');
        }

        res.json(doc);
      });
    })
    .catch((err) => {
      res.status(500).send(`Error connecting to database: ${err}`);
    });

});

router.get('/getrelateditems', (req, res) => {

  connectToDatabase()
    .then((db) => {
      db.collection('item').find({}).limit(4)
        .toArray((err, docs) => {
          if (err) {
            return res.status(500).send(`Error: ${err}`);
          }

          res.json(docs);
        })
    })
    .catch((err) => {
      res.status(500).send(`Error connecting to database: ${err}`);
    });
});
var storagedata = multer.diskStorage({ //multers disk storage settings
      destination: function (req, file, cb) {
          cb(null, 'client/app/assets/images/products');
      },
      filename: function (req, file, cb) {
          var datetimestamp = Date.now();
          cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
      }
  });
  var upload = multer({storage: storagedata}).array("uploads", 12);

router.post('/upload', function(req, res) {
    upload(req,res,function(err){
        console.log(req.file);
        if(err){
              res.json({error_code:1,err_desc:err});
              return;
        }
        res.json(req.files);
    });
});

router.post('/addreview/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const reviewDoc = {
    name: req.body.name,
    comment: req.body.comment,
    stars: Number(req.body.stars),
    date: Date.now()
  };

  connectToDatabase()
    .then((db) => {
      db.collection('item').updateOne({ _id: id }, { $push: { reviews: reviewDoc }}, (err, doc) => {
        if (err) {
          return res.status(500).send(`Error saving to database with error: ${err}`);
        }

        res.send(doc);
      })
    })

});

router.post('/addorder', (req, res) => {
  const orderDoc = {
    orderId: req.body.orderId,
    items: req.body.items,
    price: Number(req.body.price),
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    email:req.body.email,
    contact:req.body.contact,
    address:{
      address1:req.body.address1,
      address2:req.body.address2,
      city:req.body.city,
      country:req.body.country,
      state:req.body.state,
      zip:req.body.zip
    },
    status:"open",
    date: Date.now()
  };

  connectToDatabase()
    .then((db) => {
      db.collection('order').insert(orderDoc , (err, doc) => {
        if (err) {
          return res.status(500).send(`Error saving to database with error: ${err}`);
        }

        res.send(doc);
      })
      db.collection('cart').remove({ userId: req.body.items.userId })
    })

});

router.get('/getorder', (req, res) => {
  const userId = req.params.userId;

  connectToDatabase()
    .then((db) => {
      db.collection('order').find({}).sort({date: -1 })
          .toArray((err, docs) => {
            if (err) {
              return res.status(500).send(`Error: ${err}`);
            }

            res.json(docs);
          })
    }).catch((err) => {
      res.status(500).send(`Error connecting to database: ${err}`);
    });
});

router.get('/order/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  connectToDatabase()
    .then((db) => {
      console.log(orderId)
     /* db.collection('order').findOne({ orderId: Number(orderId) }, (err, item) => {
        if (err) {
          return res.status(500).send(`Error finding document in database with error: ${err}`);
        }
        item.status = "close";
        
      })*/
      db.collection('order').findOneAndUpdate({ orderId: Number(orderId) },
        { $set: { status: "close" } },
        {new: true, upsert: true}, ((err, result) => {
          if (err) {
            return res.status(500).send(`Error updating document in database with error: ${err}`);
          }

          res.send(result.value);
        })
      )
    })
});

router.get('/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  connectToDatabase()
    .then((db) => {
      db.collection('cart').findOne({ userId: userId }, (err, docs) => {
        if (err) {
          return res.status(500).send(`Error finding document in database with error: ${err}`);
        }

        res.json(docs);
      })
    })
});

router.get('/search/:queryFilter', (req, res) => {
  const queryFilter = req.params.queryFilter;

  connectToDatabase()
    .then((db) => {
      db.collection('item').find({ $text: { $search: queryFilter }}).toArray((err, docs) => {
        if (err) {
          return res.status(500).send(`Error retrieving from database with error: ${err}`);
        }

        res.send(docs);
      })
    })
});

router.post('/cart/:userId/:itemId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const itemId = parseInt(req.params.itemId);

  connectToDatabase()
    .then((db) => {
      db.collection('cart').findOne({userId: userId}, (err, doc) => {
        if (err) {
          return res.status(500).send(`Error in finding document in database with error: ${err}`);
        }

        res.json(doc);
      })
    });

});

router.post('/addtocart/:itemId/:userId', (req, res) => {
  const userId = req.params.userId;
  const itemId = parseInt(req.params.itemId);

  connectToDatabase()
    .then((db) => {
      db.collection('cart').aggregate([
        { $match: { userId: userId }},
        { $unwind: '$items' },
        { $match: { 'items._id': itemId } }
      ], ((err, doc) => {
        if (err) {
          return res.status(500).send(`Error retrieving document from database with error: ${err}`);
        }

        if (doc.length) {
          const quantity = doc[0].items.quantity + 1;
          db.collection('cart').findOneAndUpdate(
            { userId: userId, "items._id": itemId },
            { $set: { "items.$.quantity": quantity } },
            { upsert: true, returnOriginal: false },
            ((err, doc) => {
              res.send(doc.value);
            })
          )
        } else {
          db.collection('item').findOne({ _id: itemId }, ((err, item) => {
            if (err) {
              return res.status(500).send(`Error finding document in database with error: ${err}`);
            }

            item.quantity = 1;
            db.collection('cart').findOneAndUpdate(
              {userId: userId},
              {"$push": {items: item}},
              {
                upsert: true,
                returnOriginal: false
              }, ((err, result) => {
                if (err) {
                  return res.status(500).send(`Error updating document in database with error: ${err}`);
                }

                res.send(result.value);
              })
            )
          }))

        }
      }));
    })
});

module.exports = router;