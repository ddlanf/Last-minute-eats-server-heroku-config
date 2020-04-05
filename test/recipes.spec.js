const knex = require('knex')
const app = require('../src/app');
const helpers = require('./testHelpers')
require('dotenv').config()

describe('Recipe API:', function () {
  let db;
  let { addRecipes } = helpers

  
  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db.raw('TRUNCATE TABLE last_minute_eats_ratings, last_minute_eats_recipes RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE last_minute_eats_ratings, last_minute_eats_recipes RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy()); 


    describe('GET /api/recipes', () => {

        beforeEach('insert some recipes', () => {
            return db.raw(addRecipes)
        })

        it('should respond to GET `/api/recipes` with an array of recipes and status 200', function () {
        return supertest(app)
            .get('/api/recipes')
            .expect(200)
            .expect(res => {
            expect(res.body).to.be.a('array');
            res.body.forEach((item) => {
                expect(item).to.be.a('object');
                expect(item).to.include.keys('id', 'recipe_name', 'preparation_time', 'preparation_time_unit', 'ingredients', 'steps', 'image');
            });
            });
        });

    });

    describe('GET /api/recipes/:recipe_id', () => {

        beforeEach('insert recipes', () => {
            return db.raw(addRecipes)
        })

        it('should return correct recipe when given an recipe_id', () => {
        let doc;
        return db('last_minute_eats_recipes')
            .first()
            .then(_doc => {
            doc = _doc
            return supertest(app)
                .get(`/api/recipes/${doc.id}`)
                .expect(200);
            })
            .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.include.keys('id', 'recipe_name', 'preparation_time', 'preparation_time_unit', 'ingredients', 'steps', 'image');
            expect(res.body.id).to.equal(doc.id);
            expect(res.body.recipe_name).to.equal(doc.recipe_name);
            expect(res.body.preparation_time).to.equal(doc.preparation_time);
            expect(res.body.preparation_time_unit).to.equal(doc.preparation_time_unit);
            expect(res.body.ingredients).to.deep.equal(doc.ingredients);
            expect(res.body.steps).to.deep.equal(doc.steps);
            expect(res.body.image).to.equal(doc.image);
            });
        });

    })

    describe('POST /api/recipes', function () {

        it('should create and return a new recipe when provided valid data', function () {
          const newRecipe = {
            recipe_name: "Make-Ahead Breakfast Quesadilla",
            preparation_time: 5,
            preparation_time_unit: "minutes",
            ingredients: [
                "2 Sausage Links",
                "2 Eggs",
                "1 Flour Tortilla",
                "Shredded Cheddar Cheese" 
            ],
            steps: [
                "In a skillet thoroughly cook the sausage and eggs.", 
                "Place mixture in the center of a flour tortilla. Top with cheese, and fold the edges inward to form a sealed pocket.", 
                "Heat on a skillet, seam-side down. Flip and cook until golden brown.", 
                "Enjoy!"
            ],
            image: "https://i.pinimg.com/originals/92/47/da/9247daee1f90d66516f16cd4c8108cf3.jpg"
        }
    
          return supertest(app)
            .post('/api/recipes')
            .send(newRecipe)
            .expect(201)
            .expect(res => {
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys('id', 'recipe_name', 'preparation_time', 'preparation_time_unit', 'ingredients', 'steps', 'image');
              expect(res.body.recipe_name).to.equal(newRecipe.recipe_name);
              expect(res.body.preparation_time).to.equal(newRecipe.preparation_time);
              expect(res.body.preparation_time_unit).to.equal(newRecipe.preparation_time_unit);
              expect(res.body.ingredients).to.deep.equal(newRecipe.ingredients);
              expect(res.body.steps).to.deep.equal(newRecipe.steps);
              expect(res.body.image).to.equal(newRecipe.image);
              expect(res.headers.location).to.equal(`/api/recipes/${res.body.id}`)
            });
        });
    
        it('should respond with 400 status when given bad data', function () {
          const badRecipe = {
            foobar: 'broken recipe'
          };
          return supertest(app)
            .post('/api/recipes')
            .send(badRecipe)
            .expect(400);
        });
    
    });

    describe('PATCH /api/recipes/:recipe_id', () => {

        beforeEach('insert some todos', () => {
            return db.raw(addRecipes)
        })
    
        it('should update recipe when given valid data and an id', function () {
          const item = {
            'recipe_name': 'Banana Bread'
          };
          
          let doc;
          return db('last_minute_eats_recipes')
            .first()
            .then(_doc => {
              doc = _doc
              return supertest(app)
                .patch(`/api/recipes/${doc.id}`)
                .send(item)
                .expect(200);
            })
        });
    
        it('should respond with 400 status when given bad data', function () {
          const badRecipe= {
            foobar: 'broken item'
          };
          
          return db('last_minute_eats_recipes')
            .first()
            .then(doc => {
              return supertest(app)
                .patch(`/api/recipes/${doc.id}`)
                .send(badRecipe)
                .expect(400);
            })
        });
    
    });

    describe('DELETE /api/recipes/:recipe_id', () => {

        beforeEach('insert some recipes', () => {
            return db.raw(addRecipes)
        })
    
        it('should delete an recipe by id', () => {
          return db('last_minute_eats_recipes')
            .first()
            .then(doc => {
              return supertest(app)
                .delete(`/api/recipes/${doc.id}`)
                .set('Authorization', 'token sample_token')
                .expect(200);
            })
        });

        it('should return 404 without authorization token', () => {
            return db('last_minute_eats_recipes')
              .first()
              .then(doc => {
                return supertest(app)
                  .delete(`/api/recipes/${doc.id}`)
                  .expect(401);
              })
          });
    });
});