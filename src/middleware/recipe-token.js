const recipeTokensService = require('../recipeTokens/recipeTokens-service')

function requireRecipeToken(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let token
  if (!authToken.toLowerCase().startsWith('token ')) {
    return res.status(401).json({ error: 'Missing token' })
  } else {
    token = authToken.slice(6, authToken.length)
  }
  
  recipeTokensService.getByRecipeId(  req.app.get('db'), req.params.recipe_id)
    .then(recipe =>{
        if(!recipe){
          return res.status(400).json({
            error: `Could not find a token for recipe with id ${req.params.recipe_id}`,
        })}

        recipeTokensService.compareTokens(token, recipe.token)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect token',
              })

              next()
          })
    })
    .catch(next)
}

module.exports = {
  requireRecipeToken,
}