const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

/*Todo.remove({}).then((result) => {
   console.log(result);
});*/

/*Todo.findOneAndRemove({_id: '5a60bdb53bc2c33814d55d66'}).then((doc) => {

});*/

Todo.findByIdAndRemove('5a60bdb53bc2c33814d55d66').then((doc) => {
    console.log(doc);
});