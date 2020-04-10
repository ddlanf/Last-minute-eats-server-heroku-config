const knex = require('knex')
const app = require('../src/app');
const helpers = require('./testHelpers')
require('dotenv').config()

describe('Rating API:', function () {
  let db;
  let { addRatings, addRecipes } = helpers

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

  describe('GET /api/ratings', () => {

    beforeEach('insert some ratings', () => {
        return db.raw(addRecipes)
    })

    beforeEach('insert some ratings', () => {
        return db.raw(addRatings)
    })

    it('should respond to GET `/api/ratings` with an array of ratings and status 200', function () {
      return supertest(app)
        .get('/api/ratings')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.a('array');
          res.body.forEach((item) => {
            expect(item).to.be.a('object');
            expect(item).to.include.keys('id', 'recipe_id', 'rating');
          });
        });
    });

  });

  describe('POST /api/ratings/:recipe_id', function () {

    beforeEach('insert some ratings', () => {
        return db.raw(addRecipes)
    })

    it('should create and return a new rating when provided valid data', function () {
      
      const newRating = {
        "rating": 5
      }

      return supertest(app)
        .post('/api/ratings/1')
        .send(newRating)
        .expect(201)
        .expect(res=>{
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'recipe_id', 'rating');
        })
    });

    it('should respond with 400 status when given bad data', function () {
      const badRating = {
        foobar: 'broken recipe'
      }

      return supertest(app)
        .post('/api/ratings/1')
        .send(badRating)
        .expect(400);
    });

  });

  describe('PATCH /api/rating/:recipe_id', function(){
      beforeEach('insert some ratings', () => {
          return db.raw(addRecipes)
      })

      it('should respond with 400 status when given invalid data', function () {
        
        const badRating = {
          "rating": 1000,
          "id" : 1
        }

        return supertest(app)
          .patch('/api/ratings/1')
          .send(badRating)
          .expect(400)
      })
    })

})