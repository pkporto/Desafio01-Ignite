const express = require("express");
const cors = require("cors");

const { v4: uuidv4, v4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  

  const user = users.find((user1) => user1.username == username);

  if (user) {
  request.customer = user;

    return next();
  }

  return response.status(404).json({
    error: "Usuário não encontrado",
  });

}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const newUser = {
    id: v4(),
    name,
    username,
    todos: [],
  };

  const userExists = users.some(user => user.username == username);

  if(userExists){
    return response.status(400).json({error: 'Username already in use.'})
  }

  users.push(newUser);

  return response.status(201).json({
     newUser
  });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const {customer} = request;
 
  return response.status(200).json({
    message: customer.todos
  });

});

app.post("/todos", (request, response) => {
    const {title, deadline} = request.body;
    const { username } = request.headers;

    const userExists = users.find(user => user.username == username);

    if(!userExists){
      return response.status(404).json({
        message:'User not found.'
      })
    }

    const todo = {
      id: v4(),
      title: title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date()
    }

    userExists.todos.push(todo);

    return response.status(201).json({
      message: todo
    })

});

app.put("/todos/:id", (request, response) => {
   const { username } = request.headers;
   const { title, deadline } = request.body;
   const { id } = request.params;
   console.log(id);

   const userExists = users.find(user => user.username == username);

   if(!userExists){
    return response.status(404).json({
      message:'User not found.'
    })
  }
   const todo = userExists.todos.find(td =>td.id == id );

   if(!todo){
    return response.status(404).json({
      message:'Todo not found.'
    })
  }
   todo.title = title;
   todo.deadline = new Date(deadline);

   return response.status(201).json({
     message: todo
   })



});

app.patch("/todos/:id/done", (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const userExists = users.find(user => user.username == username);

   if(!userExists){
    return response.status(404).json({
      message:'User not found.'
    })
  }
  const todo = userExists.todos.find(td =>td.id == id );

  if(!todo){
   return response.status(404).json({
     message:'Todo not found.'
   })
 }

 todo.done = true;

return response.status(200).json({
  message: todo
})

});

app.delete("/todos/:id", (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const userExists = users.find(user => user.username == username);

   if(!userExists){
    return response.status(404).json({
      message:'User not found.'
    })
  }
  const todo = userExists.todos.find(td =>td.id == id );

  if(!todo){
   return response.status(404).json({
     message:'Todo not found.'
   })
 }

 const index = userExists.todos.indexOf(todo);
 userExists.todos.splice(index, 1);

 return response.status(200).json({
   message: userExists
 })

});

module.exports = app;
