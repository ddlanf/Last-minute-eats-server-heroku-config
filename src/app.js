require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const { CLIENT_ORIGIN } = require('./config')
const recipesRouter = require('./recipes/recipes-router')
const ratingsRouter = require('./ratings/ratings-router')
const emailsRouter = require('./emails/emails-router')
const recipeTokensRouter = require('./recipeTokens/recipeTokens-router')
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
)

app.use('/api/recipes', recipesRouter)
app.use('/api/ratings', ratingsRouter)
app.use('/api/emails', emailsRouter)
app.use('/api/recipe-tokens', recipeTokensRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
         response = { error: { message: 'server error' } }
  } else {
   console.error(error)
     response = { message: error.message, error }
  }
      res.status(500).json(response)
})
    

module.exports = app