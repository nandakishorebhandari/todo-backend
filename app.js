const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require('cors')
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();
app.use(cors())
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    const sql_create = `CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        status VARCHAR(100) NOT NULL,
        todo TEXT,
        username TEXT
      );`;

    database.run(sql_create, (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Successful creation of the 'Books' table");
    });
    app.listen(3010, () =>
      console.log("Server Running at http://localhost:3010/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const hasUsernameAndStatusProperties = (requestQuery) => {
  return (
    requestQuery.username !== undefined && requestQuery.status !== undefined
  );
};

const hasUsernameProperty = (requestQuery) => {
  return requestQuery.username !== undefined;
};


app.get("/todos/", async (request, response) => {
  console.log("GET /todos", " query: ", request.query);
  let data = null;
  let getTodosQuery = "";
  const { search_q = "", status, username } = request.query;
  switch (true) {
    case hasUsernameAndStatusProperties(request.query):
      getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        AND status = '${status}'
        AND username = '${username}';`;
      break;
    case hasUsernameProperty(request.query):
      getTodosQuery = `
      SELECT
        *
      FROM
        todo 
      WHERE
        username = '${username}';`;
      break;
    default:
      return response.send([]);
  }

  data = await database.all(getTodosQuery);
  response.send(data);
});


app.get("/todos/admin", async (request, response) => {
  console.log("GET /todos/admin");
  let data = null;
  let getTodosQuery = `
  SELECT
    *
  FROM
    todo;`;
  data = await database.all(getTodosQuery);
  const result = data.reduce(function (r, a) {
        r[a.username] = r[a.username] || [];
        r[a.username].push(a);
        return r;
    }, Object.create(null));

  response.send(data);
});

app.post("/todos/", async (request, response) => {
  console.log("POST /todos", "Req Body: ",request.body );
  const { todo, status, username } = request.body;
  const postTodoQuery = `
  INSERT INTO
    todo (todo, status, username)
  VALUES
    ('${todo}', '${status}', '${username}');`;
  await database.run(postTodoQuery);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId/", async (request, response) => {
  console.log("PUT /todos/:todoId", "Req Params: ",request.params, "Req Body: ",request.body  );
  const { todoId } = request.params;
  let updateColumn = "";
  const requestBody = request.body;
  switch (true) {
    case requestBody.status !== undefined:
      updateColumn = "Status";
      break;
    case requestBody.todo !== undefined:
      updateColumn = "Todo";
      break;
  }
  const previousTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE 
      id = ${todoId};`;
  const previousTodo = await database.get(previousTodoQuery);

  const {
    todo = previousTodo.todo,
    status = previousTodo.status,
  } = request.body;

  const updateTodoQuery = `
    UPDATE
      todo
    SET
      todo='${todo}',
      status='${status}'
    WHERE
      id = ${todoId};`;

  await database.run(updateTodoQuery);
  response.send(`${updateColumn} Updated`);
});

app.delete("/todos/:todoId/", async (request, response) => {
  console.log("DELETE /todos/:todoId", "Req Params: ",request.params);
  const { todoId } = request.params;
  const deleteTodoQuery = `
  DELETE FROM
    todo
  WHERE
    id = ${todoId};`;

  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
