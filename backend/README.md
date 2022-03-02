# Backend - Trivia API

## Setting up the Backend

### Install Dependencies

1. **Python 3.7** - Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

2. **Virtual Environment** - We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organized. Instructions for setting up a virual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

3. **PIP Dependencies** - Once your virtual environment is setup and running, install the required dependencies by navigating to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

#### Key Pip Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use to handle the lightweight SQL database. You'll primarily work in `app.py`and can reference `models.py`.

- [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross-origin requests from our frontend server.

### Set up the Database

With Postgres running, create a `trivia` database:

```bash
createbd trivia
```

Populate the database using the `trivia.psql` file provided. From the `backend` folder in terminal run:

```bash
psql trivia < trivia.psql
```

### Run the Server

From within the `./src` directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
flask run --reload
```

The `--reload` flag will detect file changes and restart the server automatically.

## To Do Tasks

These are the files you'd want to edit in the backend:

1. `backend/flaskr/__init__.py`
2. `backend/test_flaskr.py`

One note before you delve into your tasks: for each endpoint, you are expected to define the endpoint and response data. The frontend will be a plentiful resource because it is set up to expect certain endpoints and response data formats already. You should feel free to specify endpoints in your own way; if you do so, make sure to update the frontend or you will get some unexpected behavior.

1. Use Flask-CORS to enable cross-domain requests and set response headers.
2. Create an endpoint to handle `GET` requests for questions, including pagination (every 10 questions). This endpoint should return a list of questions, number of total questions, current category, categories.
3. Create an endpoint to handle `GET` requests for all available categories.
4. Create an endpoint to `DELETE` a question using a question `ID`.
5. Create an endpoint to `POST` a new question, which will require the question and answer text, category, and difficulty score.
6. Create a `POST` endpoint to get questions based on category.
7. Create a `POST` endpoint to get questions based on a search term. It should return any questions for whom the search term is a substring of the question.
8. Create a `POST` endpoint to get questions to play the quiz. This endpoint should take a category and previous question parameters and return a random questions within the given category, if provided, and that is not one of the previous questions.
9. Create error handlers for all expected errors including 400, 404, 422, and 500.

## Documenting your Endpoints

You will need to provide detailed documentation of your API endpoints including the URL, request parameters, and the response body. Use the example below as a reference.

<!-- ### Documentation Example

`GET '/api/v1.0/categories'`

- Fetches a dictionary of categories in which the keys are the ids and the value is the corresponding string of the category
- Request Arguments: None
- Returns: An object with a single key, `categories`, that contains an object of `id: category_string` key: value pairs.

```json
{
  "1": "Science",
  "2": "Art",
  "3": "Geography",
  "4": "History",
  "5": "Entertainment",
  "6": "Sports"
}
``` -->

## Documentation

`GET '/categories'`

Get all categories as map form, the key is categories' id 
and the value is categories' name.

- Request parameters: None
- Request payload: None
- Response body: A map contains key-value data, the key is category id and 
  the value is category name.

Response example:
```json
{
  "1": "Science",
  "2": "Art",
  "3": "Geography",
  "4": "History",
  "5": "Entertainment",
  "6": "Sports"
}
```

`GET '/questions'`

Get all questions and the results grouped by 10 elements per page.
If the number of questions less then 10, the number of items will be 
exactly it was. If the page number is too large, the array of the 
questions will be empty.

- Request parameters:  
  `page:int`, the default value is 1.
- Request payload: None
- Response body:  
  `total_questions:int`, the number of all questions that hold by db.  
  `questions:list`, a list of question, or empty.  
  `success:boolean`, which indicates the request whether successful.

Response example:
```json
{
  "success": true,
  "total_questions": 2,
  "questions": [
    {
      "answer": "Apollo 13",
      "category": 5,
      "difficulty": 4,
      "id": 2,
      "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
    }, {
      "answer": "Tom Cruise", 
      "category": 5, 
      "difficulty": 4, 
      "id": 4, 
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    }
  ]
}
```

`DELETE '/questions/${id}'`

Delete the question with specific id, if there is no question with this id,
the response will be the not found error.

- Request parameters:  
  `id:int`, the id of the question user want to delete.
- Request payload: None
- Response body:  
  `success:boolean`, if the process is successful, it will be true.

Response example:
```json
{
  "success": true
}
```

`POST '/questions'`

To create the new questions. If any of fields of required data is mission,
the process will raise 422 error.

- Request parameters: None
- Request payloads: One entity of question, including four fields, 
  `question:string`, `answer:string`, `category:int`, `difficulty:int`
- Responses body:  
  `success:boolean`, which indicates the process successful or failed.

Payload example:
```json
{
  "question": "a question",
  "answer": "an answer",
  "difficulty": 1,
  "category": 1
}
```

Response example:
```json
{
  "success": true
}
```

`POST '/filter/questions'`

Search questions whose question including the given keyword, the pagination
of the results are supported by using parameter 'page'. 

- Request parameters:  
  page:int, for pagination, the default value is 1.
- Request payloads:  
  `keyword:sting`, hold search term for searching.
- Responses body:  
  `success:boolean`, whether or not success.  
  `total_questions:int`, the number of all results under current keyword.  
  `questions:list`, the result of list that holds entities of questions. 

Payload example:
```json
{
  "keyword": "a term"
}
```

Response example:
```json
{
  "success": true, 
  "total_questions": 2,
  "questions": [{
      "answer": "Agra", 
      "category": 3, 
      "difficulty": 2, 
      "id": 15, 
      "question": "The Taj Mahal is located in which Indian city?"
    }, {
      "answer": "Escher", 
      "category": 2, 
      "difficulty": 1, 
      "id": 16, 
      "question": "Which Dutch graphic artist\u2013initials M C was a creator of optical illusions?"
    }]
}
```

`GET '/categories/${id}/questions'`

Get the questions that belong with specific category.

- Request parameters:  
  `id:int`, the id of a category.  
  `page:int`, for pagination of the results.
- Request payload: None
- Responses body:  
  `success:boolean`, whether or not success.  
  `total_questions:int`, the number of all results under given category id.  
  `questions:list`, the result of list that holds entities of questions. 

Response example:
```json
{
  "success": true, 
  "total_questions": 2,
  "questions": [{
      "answer": "Lake Victoria", 
      "category": 3, 
      "difficulty": 2, 
      "id": 13, 
      "question": "What is the largest lake in Africa?"
    }, {
      "answer": "Agra", 
      "category": 3, 
      "difficulty": 2, 
      "id": 15, 
      "question": "The Taj Mahal is located in which Indian city?"
    }]
}
```

`POST '/quizzes'`

Get a random question from the entire questions, and pick out the questions 
that provided by previous_questions. If quiz_category is 0, the scope of result
is under all categories.

- Request parameters: None
- Request payloads:  
  `quiz_category:int`, the category for scope of playing.  
  `previous_questions:list`, the list of used questions id. 
- Responses body:  
  `success:boolean`, whether or not success.  
  `question:map`, the detailed information of question. 

Payload example:
```json
{
  "previous_questions": [],
  "quiz_category": 0
}
```

Response example:
```json
{
  "success": true,
  "question": {
    "answer": "Alexander Fleming", 
    "category": 1, 
    "difficulty": 3, 
    "id": 21, 
    "question": "Who discovered penicillin?"
  }
}
```

Additional Error's examples
```json
{
  "success": false,
  "error": 404,
  "message": "Not found"
}

{
  "success": false,
  "error": 422,
  "message": "Unprocessable entity"
}

{
  "success": false,
  "error": 405,
  "message": "Method not allowed"
}

{
  "success": false,
  "error": 500,
  "message": "Please try again later"
}

```

## Testing

Write at least one test for the success and at least one error behavior of each endpoint using the unittest library.

To deploy the tests, run

```bash
dropdb trivia_test
createdb trivia_test
psql trivia_test < trivia.psql
python test_flaskr.py
```
