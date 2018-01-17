const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


/*var id = '5a5f6b98f8d2c6bc1c5f44b011';

if(!ObjectId.isValid(id)){
    console.log('ID not valid');
}*/

/*
Todo.find({
   _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
});
*/

/*
Todo.findById(id).then((todo) => {
    if(!todo){
        return console.log('Id not found');
    }
    console.log('Todo By Id', todo);
}).catch((e) => {console.log(e)});*/

const id = '5a54fa8d181f49f0298d83e7';

//User.findById
User.findById(id).then((user) => {
    if(!user){
        return console.log('User not found');
    }
   console.log('User', user);
}).catch((e) => {
    console.log(e);
});