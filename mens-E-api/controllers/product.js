var express = require("express");
const res = require("express/lib/response");
var routes = express.Router();
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var database = require("../config/database");
var collName = "product";

routes.get("/", (req, res)=>{
    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).find().toArray((err, result)=>{
            res.send(result);
        })
    })
})

routes.get("/:id", (req, res)=>{
    var id = mongodb.ObjectId(req.params.id);
    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).find({ _id : id }).toArray((err, result)=>{
            res.send(result[0]);
        })
    })
})

routes.post("/", (req, res)=>{
    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).insertOne(req.body,(err)=>{
            res.send({ success : true});
        })
    })
})

// routes.put("/:id", (req, res)=>{
//     delete req.body._id;
//     var id = mongodb.ObjectId(req.params.id);
//     MongoClient.connect(database.dbUrl, (err, con)=>{
//         var db = con.db(database.dbName);
//         db.collection(collName).updateMany({ _id : id}, { $set : req.body },()=>{
//             res.send ({ success : true });
//         })
//     })
// })
routes.put("/:id", (req, res)=>{
    delete req.body._id;
    var id = mongodb.ObjectId(req.params.id);
    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).updateMany({ _id : id }), { $set : req.body }, ()=>{
            res.send ({ success : true })
        }
    })

})

routes.delete("/:id", (req, res)=>{
    var id = mongodb.ObjectId(req.params.id);
    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).find({ _id : id }).toArray((err, result)=>{
            var obj = result[0];
            var productname = obj.name;
            db.collection("collections").deleteMany ({ product : productname },()=>{
                db.collection(collName).deleteMany ({_id : id }, ()=>{
                    res.send ({ success : true });
                })
            })
        })
    })
})



module.exports = routes;