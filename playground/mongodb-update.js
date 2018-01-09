//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    /*db.collection('Todos').findOneAndUpdate({
        _id : new ObjectID('5a5150abe6fc611f0814833b')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })*/

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a511be6e6fc611f08148336')
    }, {
        $set: {
            name: 'Pramod'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal : false
    }).then((result) => {
        console.log(result);
    })

    //db.close();
});