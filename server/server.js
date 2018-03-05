require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
//Port should be passed by heroku
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        return res.send(doc);
    }, (e) => {
        return res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
       return res.send({todos});
   }, (e) => {
       return res.status(400).send(e);
   });
});

//GET todos/12341234
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    //Validate id using isValid
        //404 -- send back empty body
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    //findById
    Todo.findById(id).then((todo) => {
        //sucess
        //if todo --send it back
        if(todo){
            return res.status(200).send({todo});
        }else {
            //if no todo -- send back 404 with empty body
            return res.status(404).send();
        }
    }, (e) => {
        //error
        //400 -- and send empty body back
        return res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
   var id = req.params.id;

    //validate the id -> not valid? return 404
   if(!(ObjectId.isValid(id))){
       res.status(404).send();
   }
    //remove todo by id
   Todo.findByIdAndRemove(id).then((todo) => {
       //if no doc, send 404
       if(!todo){
           return res.status(404).send();
       }else{
           //success
           //if doc, send doc back with 200
           return res.status(200).send({todo});
       }
   }, (err) => {
       //error
       //400 with empty body
       return res.status(400).send();
   });
});

app.patch('/todos/:id', (req, res) => {
   var id = req.params.id;
   var body = _.pick(req.body, ['text', 'completed']);

    //validate the id -> not valid? return 404
    if(!(ObjectId.isValid(id))){
        res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }

        res.send({todo});

    }).catch((e) => {
       res.status(400).send();
    });

});

app.post('/users', (req,res)=> {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch((e) => {
        res.status(400).send();
    });

});

app.delete('/users/me/token', authenticate, (req, res) => {
   req.user.removeToken(req.token).then(() => {
       res.status(200).send();
   }, () => {
       res.status(400).send();
   });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};