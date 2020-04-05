const express = require('express')
const RecipesService = require('./recipes-service')
const recipesRouter = express.Router()
const jsonBodyParser = express.json()
const { requireToken } = require('../middleware/auth-token')
const path = require('path')

recipesRouter
    .route('/')
    .get((req, res, next) => {
       RecipesService.getAllRecipes(req.app.get('db'))
            .then(recipes => res.json(recipes))
    })
    .post(jsonBodyParser, (req, res, next) =>{
        const {
            recipe_name, preparation_time,
            preparation_time_unit, ingredients,
            steps, image
        } = req.body



        const newRecipe = {
            recipe_name, preparation_time,
            preparation_time_unit, ingredients,
            steps, image
        }

        for(let [key, value] of Object.entries(newRecipe)){
            if(value == null){
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
        }

        if(!newRecipe.steps.length){
            return res.status(400).json({
                error: `Missing steps in request body`
            })
        }
        
        if(!newRecipe.ingredients.length){
            return res.status(400).json({
                error: `Missing ingredients in request body`
            })
        }

        if(!(preparation_time_unit === 'minutes') && !(preparation_time_unit === 'seconds')){
            return res.status(400).json({
                error: `Invalid unit`
            })
        }

        if(preparation_time > 60 && preparation_time_unit === 'seconds'){
            return res.status(400).json({
                error: `use 'minutes' for any duration more than 60 seconds`
            })
        }

        if(preparation_time > 15 && preparation_time_unit === 'minutes'){
            return res.status(400).json({
                error: `preparation time needs to be less than or equal to 15 mins`
            })
        }

        RecipesService.insertRecipe(req.app.get('db'), newRecipe)
            .then(recipe => {
                res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
                .json(recipe)
        })
        .catch(next)
    })

recipesRouter
    .route('/:recipe_id')
    .get((req, res, next) => {
        RecipesService.getById(req.app.get('db'), req.params.recipe_id)
            .then(recipe => {
                res.status(200).json(recipe)
             })
     })
    .patch(jsonBodyParser, (req, res, next) =>{
        const {
            recipe_name, preparation_time,
            preparation_time_unit, ingredients,
            steps, image
        } = req.body

        const recipeToUpdate = {
            recipe_name, preparation_time,
            preparation_time_unit, ingredients,
            steps, image
        }

        const { recipe_id } = req.params 
  
        const numberOfValues = Object.values(recipeToUpdate).filter(Boolean).length
        
        if (numberOfValues === 0)
          return res.status(400).json({
            error: {
              message: `Request body must content at least one change`
            }
        })

        RecipesService.updateRecipe(req.app.get('db'), recipeToUpdate, recipe_id)
            .then(numRowsAffected => {
                    return res.status(200).end()
            })
            .catch(next)
           
    })
    .delete(requireToken, (req, res, next) =>{
        RecipesService.deleteRecipe(req.app.get('db'), req.params.recipe_id)
            .then(recipe => {
                res.json(recipe)
             })
    })

module.exports = recipesRouter