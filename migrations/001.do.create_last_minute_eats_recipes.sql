CREATE TABLE last_minute_eats_recipes (
  id SERIAL PRIMARY KEY,
  recipe_name TEXT NOT NULL,
  preparation_time INTEGER NOT NULL,
  ingredients TEXT[] NOT NULL,
  steps TEXT[] NULL,
  image TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
