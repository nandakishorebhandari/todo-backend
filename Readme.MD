# Todo Application

Given an `app.js` file and an empty database file `todoApplication.db`.

Create a table with the name `todo` with the following columns,

**Todo Table**

| Column   | Type    |
| -------- | ------- |
| id       | INTEGER PRIMARY KEY AUTOINCREMENT |
| username | TEXT |
| todo     | TEXT    |
| status   | VARCHAR(100) NOT NULL    |

and write APIs to perform operations on the table `todo`,

<MultiLineNote>
  
  - Replace the spaces in URL with `%20`.
  - Possible values for `status` are `active` and `complete`.
  - Possible values for `username` are any text .
  - Possible values for `todo` are any text .
</MultiLineNote>

### API 1

#### Path: `/todos/`

#### Method: `GET`

- **Scenario 1**

  - **Sample API**
    ```
    /todos/?status=active&username=myself
    ```
  - **Description**:

    Returns a list of all todos whose status is 'active' and username is 'myname'

  - **Response**

    ```
    [
      {
        status: "active",
        username: "myname"
      },
      ...
    ]
    ```

- **Scenario 2**

  - **Sample API**
    ```
    /todos/?status=complete&username=myself
    ```
  - **Description**:

    Returns a list of all todos whose status is 'complete' and username is 'myname'

  - **Response**

    ```
    [
      {
        status: "complete"
        username: "myname"
      },
      ...
    ]
    ```

- **Scenario 4**

  - **Sample API**
    ```
    /todos/?search_q=Play&username=myself
    ```
  - **Description**:

    Returns a list of all todos whose todo contains 'Play' text

  - **Response**

    ```
    [
      {
        id: 4,
        todo: "Play volleyball",
        status: "complete"
        username: "myself"
      },
      ...
    ]
    ```


### API 2

#### Path: `/todos/`

#### Method: `POST`

#### Description:

Create a todo in the todo table,

#### Request

```
{
  "id": 10,
  "todo": "Finalize event theme",
  "status": "active"
  "username": "myself"
}
```

#### Response

```
Todo Successfully Added
```

### API 3

#### Path: `/todos/:todoId/`

#### Method: `PUT`

#### Description:

Updates the details of a specific todo based on the todo ID

- **Scenario 1**

  - **Request**
    ```
    {
      "status": "complete"
    }
    ```
  - **Response**

    ```
    Status Updated
    ```


- **Scenario 3**

  - **Request**
    ```
    {
      "todo": "Some task"
    }
    ```
  - **Response**

    ```
    Todo Updated
    ```

### API 4

#### Path: `/todos/:todoId/`

#### Method: `DELETE`

#### Description:

Deletes a todo from the todo table based on the todo ID

#### Response

```
Todo Deleted
```

<br/>

Use `npm install` to install the packages.

**Export the express instance using the default export syntax.**

**Use Common JS module syntax.**