DROP TYPE IF EXISTS  units;

CREATE TYPE units AS ENUM(
    'minutes',
    'seconds'
);

ALTER TABLE last_minute_eats_recipes
  ADD COLUMN
    preparation_time_unit units;