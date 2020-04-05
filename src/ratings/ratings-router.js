const express = require('express')
const RatingsService = require('./ratings-service')
const ratingsRouter = express.Router()
const jsonBodyParser = express.json()
//const { requireToken } = require('../middleware/auth-token')

ratingsRouter
    .route('/')
    .get((req, res, next) => {
       RatingsService.getAllRatings(req.app.get('db'))
            .then(ratings => res.json(ratings))
    })
    .post(jsonBodyParser, (req, res, next) =>{
        const { rating, recipe_id } = req.body

        const newRating = { rating, recipe_id } 

        for(let [key, value] of Object.entries(newRating)){
            if(value == null){
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
        }

        if(rating > 5 || rating < 1){
            return res.status(400).json({
                error: `Rating needs to be between 1 and 5`
            })
        }

        RatingsService.insertRating(req.app.get('db'), newRating)
            .then(rating => {
                res.status(201).json(rating)
        })
        .catch(next)
    })

module.exports = ratingsRouter