const RecipesService = {
    getAllRecipes(db){
        return db
            .from('last_minute_eats_recipes as recipe')
            .select(
                'recipe.id',
                'recipe.recipe_name',
                'recipe.preparation_time',
                'recipe.preparation_time_unit',
                'recipe.ingredients',
                'recipe.steps',
                'recipe.image',
                db.raw(`
                (SELECT ROUND( AVG(rating), 2) FROM last_minute_eats_ratings
                    WHERE recipe_id = recipe.id
                ) AS "overall_rating"`)
            )   
    },
    getById(db, id) {
        return RecipesService.getAllRecipes(db)
          .where('id', id)
          .first()
    },
    insertRecipe(db, newRecipe) {
        return db
          .insert(newRecipe)
          .into('last_minute_eats_recipes')
          .returning('*')
          .then(([recipe]) => recipe)
          .then(recipe =>
            RecipesService.getById(db, recipe.id)
          )
    },
    updateRecipe(db, updatedRecipe, id){
        return RecipesService.getById(db, id)
          .update(updatedRecipe)
    },
    deleteRecipe(db, id) {
        return db
          .from('last_minute_eats_recipes')
          .where('id', id )
          .delete()
    }
}

module.exports = RecipesService