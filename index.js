// importing libraries
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// creating server application
const app = express();
app.use(cors());

// setting up morgan
morgan.token('content', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'));

// using middlewares
app.use(express.json());


// creating psudo data
let tasks = [
  {
    "id": "1",
    "task": "Finish reading the book",
    "completed": true
  },
  {
    "id": "2",
    "task": "Buy groceries",
    "completed": false
  },
  {
    "id": "3",
    "task": "Call mom",
    "completed": false
  }
]

// helper functions
const generateId = (length = 5) => {
  const alphaNumeric = 'ABCDEFGHJIKLMNMOPQRSTUVWXYZ1234567890';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += alphaNumeric[Math.floor(Math.random() * alphaNumeric.length)];
  }
  return id;
}


// route: get all tasks
app.get('/api/tasks', (request, response) => {
  response.json(tasks);
});


// route: get specific task
app.get('/api/tasks/:id', (request, response) => {
  const id = request.params.id;
  const task = tasks.find(task => task.id === id);
  if (task) {
    response.json(task);
  } else {
    response.status(404).json({message: `Task with ID '${id}' not found!`});
  }
});


// route: add task
app.post('/api/tasks', (request, response) => {
  if (request.body.task) {

    // creating new task
    const task = {
      id: generateId(),
      task: request.body.task,
      completed: request.body.completed || false
    }

    // checking if task exits
    const dubCheck = tasks.find(t => t.task === task.task);

    if (dubCheck) {
      response.status(409).json({message: "Task already exist!"});
    
    } else {

      // adding new task to data
      tasks = tasks.concat(task);
      response.json(task);
    }
  
  } else {
    response.status(400).json({message: "Bad request!"});
  }
});


// route: update task
app.put('/api/tasks/:id', (request, response) => {
  const id = request.params.id;

  // checking if task exits
  let dubCheck = tasks.find(t => t.id === id);

  if (dubCheck) {
    dubCheck = {
      id: dubCheck.id,
      task: request.body.task || dubCheck.task,
      completed: (request.body.completed == undefined) ? dubCheck.completed : request.body.completed
    };

    tasks = tasks.map(task => {
      return (task.id === id) 
        ? dubCheck
        : task;
    })
    
    response.json(dubCheck);
    
  } else {
    response.status(404).json({message: `Task with ID '${id}' not found!`});
  }
});


// route: delete task
app.delete('/api/tasks/:id', (request, response) => {
  const id = request.params.id;

  // checking if task exits
  let dubCheck = tasks.find(t => t.id === id);

  if (dubCheck) {
    tasks = tasks.filter(task => task.id !== id);
    response.json({sucess: `Task with ID '${id}' sucessfully deleted!`});
    
  } else {
    response.status(404).json({message: `Task with ID '${id}' not found!`});
  }
})


// starting server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));