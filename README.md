# **Last Minute Eats Server**

Website Link : [https://last-minute-eats.now.sh](https://last-minute-eats.now.sh)

## Image
![Screenshot1](/images/screenshot1.PNG)
![Screenshot2](/images/screenshot2.PNG)

## Core Features
This an express server used in the "Last Minute Eats" app. 
The endpoints this API provides include the following. 

**/api/recipes**
- [GET] / - return all recipes 
- [POST] / - add a new recipe
- [GET] /:recipe_id - return a recipe with corresponding recipe_id
- [PATCH] /:recipe_id - make edit to the recipe with corresponding recipe_id
- [DELETE] /:recipe_id - delete a recipe with corresponding recipe_id

**/api/ratings**
- [GET] / - return all ratings
- [POST] /:recipe_id - add rating to the recipe with corresponding recipe_id
- [PATCH] /:id change the rating with correspoding id

 **/api/recipe-tokens**
 - [POST] / - add a new token to the recipe with correspoding id specified in the body
 - [GET] /recipe_id - checks whether given authorization token is valid 

 **/api/emails**
 - [GET] / - return all emails
 - [POST] / - add a new email

 ## Technologies used
- Node.js (Express)
- PostgreSQL
- Heroku Server and Database (Deployment)
- Testing with Mocha, Chai, and Supertest

## Running the server with client locally
Clone [Last-minute-eats-client](https://github.com/ddlanf/Last-minutes-eats-client) repository.
Once you clone both client and server, do the following.
1. In "myusedcarsalesman-client", change the API_ENDPOINT in config.js to localhost:8000 or any other ports that may be used.
2. Configure the CORS setting in "last-minute-eats-server" to allow localhost to send requests. This is can be done simply by adding app.use(cors()) in App.js file or changing the value of CLIENT_ORIGIN in config.js  
3. Run both client and server with "npm start". "npm run dev" can also be used in "myusedcarsalesman-api-auth"<!-- Just adding a random comment --><!-- Just adding a random comment --><!-- Just adding a random comment --><!-- Just adding a random comment --><!-- Just adding a random comment -->