const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const RecipeTokensService = {
    getAllRecipeTokens(db){
        return db
            .from('last_minute_eats_recipe_tokens as recipe_token')
            .select(
                'recipe_token.id',
                'recipe_token.token',
                'recipe_token.recipe_id')
    },
    getById(db, id) {
        return RecipeTokensService.getAllRecipeTokens(db)
          .where('id', id)
          .first()
    },
    getByRecipeId(db, recipe_id) {
        return RecipeTokensService.getAllRecipeTokens(db)
          .where('recipe_id', recipe_id)
          .first()
    },
    insertRecipeToken(db, recipeToken) {
        return db
          .insert(recipeToken)
          .into('last_minute_eats_recipe_tokens')
          .returning('*')
          .then(([recipe_token]) => recipe_token)
          .then(recipe_token =>
            RecipeTokensService.getById(db, recipe_token.id)
          )
    },
    deleteRecipeToken(db, id) {
        return db
          .from('last_minute_eats_recipe_tokens')
          .where('id', id )
          .delete()
    },
    validateToken(token) {
        if (token.length < 8) {
          return 'Token must be longer than 8 characters'
        }
        if (token.length > 72) {
          return 'Token be less than 72 characters'
        }
        if (token.startsWith(' ') || token.endsWith(' ')) {
          return 'Token must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(token)) {
          return 'Token must contain one upper case, lower case, number and special character'
        }
        return null
    },
    hashToken(token) {
        return bcrypt.hash(token, 12)
    },
    tokenAlreadyExists(db, recipe_id) {
        return db('last_minute_eats_recipe_tokens')
          .where({ recipe_id })
          .first()
          .then(recipe_id => !!recipe_id)
    },
    compareTokens(token, hash) {
        return bcrypt.compare(token, hash)
    }
}

module.exports = RecipeTokensService