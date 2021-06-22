const express = require('express');
const faunadb = require('faunadb'),
  q = faunadb.query;

const client = new faunadb.Client({
  secret: 'YOUR_FAUNADB_SERVER_SECRET',
});

const app = express();
app.use(express.json())
const PORT = process.env.PORT || 8000;


app.get('/todos', async (req, res) => {
  try {
    let todos = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("todos"))),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )

    res.status(200).json(todos)
  } catch (error) {
    res.status(500).json({error: error.description})
  }
});


app.get('/todos/:id', async (req, res) => {
  try {
    const {data} = await client.query(
      q.Get(q.Ref(q.Collection('todos'), req.params.id))
    );
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({error: error.description})
  }
});


app.post('/todos', async (req, res) => {
  
  try {
    const {title, description } = req.body;
    const todo = await client.query(
      q.Create(q.Collection('todos'), { data: { title, description } })
    );
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({error: error.description})
  }
});


app.put('/todos/:id', async (req, res) => {
  
  try {
    const {title, description } = req.body;
    const { data } = await client.query(
      q.Update(q.Ref(q.Collection('todos'), req.params.id), 
      { data: { title, description } },
      )
    );
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({error: error.description})
  }
});


app.delete('/todos/:id', async (req, res) => {
  
  try {
    const { data } = await client.query(
      q.Delete(q.Ref(q.Collection('todos'),  req.params.id))
    );
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({error: error.description})
  }
});

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
