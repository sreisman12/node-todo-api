//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    /*db.collection('Todos').deleteMany({
       text: 'Eat Lunch'
    }).then((result)=>{
        console.log(result);
    });*/

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result)=> {
    //     console.log(result);
    // });

    // findOneAndDelete
    /*db.collection('Todos').findOneAndDelete({completed: false}).then((result)=> {
        console.log(result);
    });*/

    //Delete Many from Users
    // db.collection('Users').deleteMany({name: 'Steven'}).then((result)=> {
    //     console.log(result);
    // });

    //findOneAndDelete from Users
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5a511bd8e6fc611f08148335')}).then(
        (result)=> {
            console.log(result);
        }
    );

    //db.close();
});