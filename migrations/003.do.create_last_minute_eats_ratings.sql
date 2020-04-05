CREATE TABLE last_minute_eats_ratings (
     id SERIAL PRIMARY KEY,
     rating INTEGER CHECK(6 > rating AND rating > 0) NOT NULL,
     recipe_id INTEGER
        REFERENCES last_minute_eats_recipes(id) ON DELETE CASCADE NOT NULL
);