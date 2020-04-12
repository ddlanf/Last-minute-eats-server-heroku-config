CREATE TABLE last_minute_eats_recipe_tokens (
     id SERIAL PRIMARY KEY,
     token TEXT NOT NULL,
     recipe_id INTEGER
        REFERENCES last_minute_eats_recipes(id) ON DELETE CASCADE NOT NULL
);