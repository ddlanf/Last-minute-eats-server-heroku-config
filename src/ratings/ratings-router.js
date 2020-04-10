const express = require('express')
const RatingsService = require('./ratings-service')
const ratingsRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')
//const { requireToken } = require('../middleware/auth-token')

ratingsRouter
    .route('/')
    .get((req, res, next) => {
       RatingsService.getAllRatings(req.app.get('db'))
            .then(ratings => res.json(ratings))
    })

ratingsRouter
    .route('/:recipe_id')
    .post(jsonBodyParser, (req, res, next) =>{
        
        const { rating } = req.body
        const { recipe_id } = req.params 

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
                res.status(201)
                .location(path.posix.join(req.originalUrl, `/${rating.id}`))
                .json(rating)
        })
        .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) =>{
        const { rating, id } = req.body
        const { recipe_id } = req.params 
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

        RatingsService.updateRating(req.app.get('db'), newRating, id)
        .then(rating => {
            return res.status(200).json(rating)
        })
        .catch(next)

    })

module.exports = ratingsRouter