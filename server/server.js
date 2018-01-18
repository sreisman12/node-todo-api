var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectId} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       res.send({todos});
   }, (e) => {
       res.status(400).send(e);
   });
});

//GET todos/12341234
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    //Validate id using isValid
        //404 -- send back empty body
    if(!ObjectId.isValid(id)){
        res.status(404).send();
    }

    //findById
    Todo.findById(id).then((todo) => {
        //sucess
        //if todo --send it back
        if(todo){
            res.status(200).send({todo});
        }else {
            //if no todo -- send back 404 with empty body
            res.status(404).send();
        }
    }, (e) => {
        //error
        //400 -- and send empty body back
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};