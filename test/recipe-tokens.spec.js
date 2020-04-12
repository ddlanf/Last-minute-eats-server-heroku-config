const knex = require('knex')
const app = require('../src/app');
const helpers = require('./testHelpers')
require('dotenv').config()

describe('Recipe Token API:', function () {
  let db;
  let { addRecipes, addToken } = helpers

  
  before('make knex instance', () => {  
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  });
  
  before('cleanup', () => db.raw('TRUNCATE TABLE last_minute_eats_recipe_tokens, last_minute_eats_ratings, last_minute_eats_recipes RESTART IDENTITY;'));

  afterEach('cleanup', () => db.raw('TRUNCATE TABLE last_minute_eats_recipe_tokens, last_minute_eats_ratings, last_minute_eats_recipes RESTART IDENTITY;')); 

  after('disconnect from the database', () => db.destroy()); 


  describe('POST /api/recipe-tokens', function () {

    beforeEach('insert some tokens', () => {
        return db.raw(addRecipes)
    })

    it('should create and return a new token when provided valid data', function () {
      const newToken = {
        recipe_id : 1,
        token : "Hello12345@"
      }

      return supertest(app)
        .post('/api/recipe-tokens')
        .send(newToken)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'recipe_id', 'token');
          expect(res.body.recipe_id).to.equal(newToken.recipe_id);
        });
    });

    it('should respond with 400 status when given bad data', function () {
      const badToken = {
        foobar: 'broken token'
      };
      return supertest(app)
        .post('/api/recipe-tokens')
        .send(badToken)
        .expect(400);
    }); 

    });

    describe('POST /api/recipe-tokens', function () {

        beforeEach('insert some tokens', () => {
            return db.raw(addRecipes)
        })

        beforeEach('insert some recipes', () => {
            return db.raw(addToken)
        })

        it('should respond with 200 status when given valid token', function () {
            let doc;
            return db('last_minute_eats_recipes')
              .first()
              .then(_doc => {
                doc = _doc
                return supertest(app)
                  .get(`/api/recipe-tokens/${doc.id}`)
                  .set('Authorization', 'token sample_token')
                  .expect(200)
              });
        }); 

        it('should respond with 400 status when given invalid token', function () {
            let doc;
            return db('last_minute_eats_recipes')
              .first()
              .then(_doc => {
                doc = _doc
                return supertest(app)
                  .get(`/api/recipe-tokens/${doc.id}`)
                  .set('Authorization', 'token invalid_token')
                  .expect(400)
              });
        }); 

    })
})