# Rule Engine API

A rule-based engine API that allows the creation, combination, evaluation, and modification of rules defined by users. This application uses MongoDB for rule storage, Express.js as the backend framework, and React.js for a user interface to interact with the rule engine.

### Architecture
* The application follows a simple client-server architecture:

** Backend: Built using Node.js and Express, it handles API requests for rule creation, combination, evaluation, and modification. Mongoose is used to interact with the MongoDB database.

** Frontend: Built using React, it provides a user interface for interacting with the rule engine. The frontend communicates with the backend using Axios for HTTP requests.

## Features

1. **Create Rule**: Create a new rule by providing a rule string. The application generates an Abstract Syntax Tree (AST) based on the rule.
2. **Combine Rules**: Combine two or more rules using logical operators.
3. **Evaluate Rule**: Evaluate a rule against user-defined data inputs.
4. **Modify Rule**: Modify existing rules by changing operators, operands, or sub-expressions.

## Rule Creation and Evaluation
** The application allows users to create rules in a specified string format. Rules can be combined using logical 
   operators (AND/OR), evaluated against user-defined data, and modified as needed.

** Abstract Syntax Tree (AST): The rules are transformed into an AST, which facilitates easy evaluation and 
   modification of the rules.
** User-Defined Functions: The application supports a basic set of user-defined functions for advanced rule 
   conditions (e.g., checking if a salary is high).

### Backend

- **Node.js**: The application is built on Node.js. Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Express**: A web application framework for Node.js.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Cors**: A middleware for enabling CORS (Cross-Origin Resource Sharing).
- **Body-parser**: A middleware for parsing incoming request bodies.
- **Axios**: A promise-based HTTP client for the frontend to interact with the backend.

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **ReactDOM**: Provides DOM-specific methods for React.
- **Axios**: Used for making HTTP requests to the backend API.

## API Endpoints

### POST `/create_rule`

- **Description**: Create a new rule with a rule string and generate its AST.
- **Request Body**:
  ```json
  {
    "ruleString": "<rule_string>"
  }

Response:
{
  "message": "Rule created",
  "rule": {
    "ruleString": "<rule_string>",
    "ast": "<ast_representation>"
  }
}

### POST /combine_rules

* Description: Combines two or more rules into a single rule.
* Request Body:

{
  "_id": ["<rule_id_1>", "<rule_id_2>"]
}

* Response:
{
  "message": "Rules combined",
  "combinedRule": {
    "ruleString": "<combined_rule_string>",
    "ast": "<combined_ast>"
  }
}

### POST /evaluate_rule
* Description: Evaluates a rule based on user data inputs.
* Request Body:

{
  "ruleId": "<rule_id>",
  "data": {
    "attribute": "<value>",
    ...
  }
}

* Response:
{
  "result": <evaluation_result>
}

### POST /modify_rule

* Description: Modifies an existing rule by changing the rule string and updating its AST.

* Request Body:

{
  "ruleId": "<rule_id>",
  "newRuleString": "<new_rule_string>"
}

*Response:
{
  "message": "Rule modified",
  "rule": {
    "ruleString": "<new_rule_string>",
    "ast": "<new_ast>"
  }
}

### Setup Instructions
## Prerequisites
** Node.js and npm
** MongoDB (or MongoDB Atlas)
**React

## Installation

cd rule-engine

## Install Backend Dependencies:

** cd backend
** npm install

## Install Frontend Dependencies:

** cd rule-engine-ui
** npm install

## Configuration
1. Backend Configuration:

* Create a .env file in the backend folder and add your MongoDB connection string:
* env

** MONGODB_URI=<your_mongodb_connection_string>
   PORT=5000

2. Frontend Configuration:

* Update the API endpoint in rule-engine-ui/src/api.js:

const API_URL = 'http://localhost:5000';


## Running the Application
## Start Backend:

** cd backend
** npm start

## Start Frontend:

** cd frontend
** npm start
## Testing
You can test the application by making requests to the backend using Postman or by interacting with the frontend UI.

Known Issues and Improvements
* Error Handling: Enhance error handling for malformed rules and undefined attributes.
* Validation: Expand attribute validation to check against a predefined catalog.
* User-Defined Functions: Extend the rule language to allow complex, user-defined conditions for advanced logic.