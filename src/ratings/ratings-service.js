const RatingsService = {
    getAllRatings(db){
        return db
            .from('last_minute_eats_ratings as rating')
            .select(
                'rating.id',
                'rating.rating',
                'rating.recipe_id',
            )   
    },
    getById(db, id) {
        return RatingsService.getAllRatings(db)
          .where('id', id)
          .first()
    },
    insertRating(db, newRating) {
        return db
          .insert(newRating)
          .into('last_minute_eats_ratings')
          .returning('*')
          .then(([recipe]) => recipe)
          .then(recipe =>
            RatingsService.getById(db, recipe.id)
          )
    },
    updateRating(db, updatedRating, id){
      return RatingsService.getById(db, id)
        .update(updatedRating)
        .returning('*')
          .then(([recipe]) => recipe)
          .then(recipe =>
            RatingsService.getById(db, recipe.id)
          )
  }
}

module.exports = RatingsService