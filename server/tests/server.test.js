const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed.js');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
       var text = 'Test todo text';

       request(app)
           .post('/todos')
           .send({text})
           .expect(200)
           .expect((res) => {
                expect(res.body.text).toBe(text);
           })
           .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
           });
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                   expect(todos.length).toBe(2);
                   done();
                }).catch((e) => done(e));
            });

    });
});

describe ('GET /todos', () => {
   it('should get all todos', (done) => {
       request(app)
           .get('/todos')
           .expect(200)
           .expect((res) => {
           expect(res.body.todos.length).toBe(2);
           })
           .end(done);
   });
});

describe ('GET /todos/:id', () => {
    it('should get todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        //make sure you get a 404 back
        request(app)
            .get(`/todos/${(new ObjectID).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        //todos/123
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe ('DELETE /todos/:id', () => {
   it('should remove a todo', (done) => {
       var hexId = todos[1]._id.toHexString();

       request(app)
           .delete(`/todos/${hexId}`)
           .expect(200)
           .expect((res) => {
           expect(res.body.todo._id).toBe(hexId);
           })
           .end((err, res) => {
           if(err) {
               return done(err);
           }

           //query database using findById
               Todo.findById(hexId).then((todo) => {
                   expect(todo).toNotExist();
                   done();
               }, (err) => {
                    return done(err);
               });
               //expect(null).toNotExist();
           });
   });

   it('should return 404 if todo not found', (done) => {
       request(app)
           .delete(`/todos/${(new ObjectID).toHexString()}`)
           .expect(404)
           .end(done);
   });

   it('should return 404 if object id is invalid', (done) => {
       request(app)
           .delete('/todos/123')
           .expect(404)
           .end(done);
   });
});

describe('PATCH /todos/:id', () => {
   it('should update the todo', (done) => {
      //grab id of first item
       var hexId = todos[0]._id.toHexString();

       //update text, set completed true
       var updateBody = {
           "text": "Update test",
           "completed": true
       };
       //200
       //response body has text, completed is true, completedAt is a number .toBeA
       request(app)
           .patch(`/todos/${hexId}`)
           .send(updateBody)
           .expect(200)
           .expect((res) => {
           expect(res.body.todo.text).toBe(updateBody.text);
           expect(res.body.todo.completed).toBe(true);
           expect(res.body.todo.completedAt).toBeA('number');
           })
           .end(done);

   });

   it('should clear completedAt when todo is not completed', (done) => {
       //grab id of second todo item
       var hexId = todos[1]._id.toHexString();
       //update text, set completed to false
       var updateBody = {
           "text": "Update test",
           "completed": false
       };
       //200
       //text is changed, completed false, completedAt is null .toNotExist
       request(app)
           .patch(`/todos/${hexId}`)
           .send(updateBody)
           .expect(200)
           .expect((res) => {
           expect(res.body.todo.text).toBe(updateBody.text);
           expect(res.body.todo.completed).toBe(false);
           expect(res.body.todo.completedAt).toNotExist();
           })
           .end(done);
   });
});

describe('GET /users/me', () => {
   it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
   });

   it('should return 401 if not authenticated', (done) => {
       request(app)
           .get('/users/me')
           .expect(401)
           .expect((res) => {
           expect(res.body).toEqual({});
           })
           .end(done);

   });
});

describe('POST /users', ()=> {
   it('should create a user', (done) => {
       var email = 'example@example.com';
       var password = '123mnb!';

       request(app)
           .post('/users')
           .send({email, password})
           .expect(200)
           .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
           })
           .end((err) => {
            if(err) {
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((err) => {
                return done(err);
            });
           });
   });

   it('should return validation errors if invalid', (done) => {
       var email = 'bad';
       var password = 'bad';

       request(app)
           .post('/users')
           .send({email, password})
           .expect(400)
           .end(done);
   });

   it('should not create user if email in use', (done) => {
       var email = users[0].email;
       var password = 'abc123!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.body.code).toBe(11000);
            })
            .end(done);
   });
});