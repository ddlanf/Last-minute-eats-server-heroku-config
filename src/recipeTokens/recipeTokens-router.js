const express = require('express')
const RecipeTokensService = require('./recipeTokens-service')
const RecipesService = require('../recipes/recipes-service')
const recipeTokensRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')
const { requireRecipeToken } = require('../middleware/recipe-token')

recipeTokensRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) =>{
        
        const { token, recipe_id } = req.body
    
        for(let [key, value] of Object.entries({ token, recipe_id })){
            if(value == null){
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
            }
        }

        const tokenError = RecipeTokensService.validateToken(token)

        if (tokenError)
            return res.status(400).json({ error: tokenError })

    RecipesService.getById(req.app.get('db'), recipe_id)
        .then(recipe =>{
                if(!recipe){
                  return res.status(400).json({ 
                      error: `Could not find a recipe with id ${recipe_id}`})}
    })
        
      RecipeTokensService.tokenAlreadyExists(req.app.get('db'), recipe_id)
            .then(recipe_id_exits => {
                if(recipe_id_exits){
                    return res.status(400).json({ error: `Token alreadys exists for this recipe` })
                }

            RecipeTokensService.hashToken(token)
                .then(hashedToken =>{
    
                    const recipeToken = {
                        token : hashedToken,
                        recipe_id
                    }
    
                    return RecipeTokensService.insertRecipeToken(req.app.get('db'), recipeToken)
                        .then(recipeToken => {
                            res.status(201)
                            .location(path.posix.join(req.originalUrl, `/${recipeToken.id}`))
                            .json(recipeToken)
                    })
                    .catch(next)
                })
       })


     })
    
recipeTokensRouter
    .route('/:recipe_id')
    .get(requireRecipeToken, (req, res, next)=>{
        res.status(200).json("correct token")
    })
    
 
module.exports = recipeTokensRouter