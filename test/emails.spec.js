const knex = require('knex')
const app = require('../src/app');
const helpers = require('./testHelpers')
require('dotenv').config()

describe('Email API:', function () {
    let db;
    let { addEmail } = helpers
  
    before('make knex instance', () => {  
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    });
    
    before('cleanup', () => db.raw('TRUNCATE TABLE last_minute_eats_emails'));
  
    afterEach('cleanup', () => db.raw('TRUNCATE TABLE last_minute_eats_emails')); 
  
    after('disconnect from the database', () => db.destroy()); 

    describe('GET /api/emails', () => {

        beforeEach('insert some emails', () => {
            return db.raw(addEmail)
        })
    
        it('should respond to GET `/api/emails` with an array of emails and status 200', function () {
          return supertest(app)
            .get('/api/emails')
            .set('Authorization', 'token sample_token')
            .expect(200)
            .expect(res => {
              expect(res.body).to.be.a('array');
              res.body.forEach((item) => {
                expect(item).to.be.a('object');
                expect(item).to.include.keys('id', 'email');
              });
            });
        });
    })

    describe('POST /api/emails', function () {

        it('should create and return a new email when provided valid data', function () {
          
          const newEmail = {
            "email": "hello@gmail.com"
          }
    
          return supertest(app)
            .post('/api/emails')
            .send(newEmail)
            .expect(201)
            .expect(res=>{
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id', 'email');
            })
        });
    
        it('should respond with 400 status when given bad data', function () {
          const badEmail = {
            foobar: 'broken recipe'
          }
    
          return supertest(app)
            .post('/api/emails')
            .send(badEmail)
            .expect(400);
        });
    
      });
})