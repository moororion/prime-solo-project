-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE pantry (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "quantity" INT NOT NULL,
    "date_bought" DATE NOT NULL,
    "expiration_date" DATE NOT NULL,
    "calories" INT,
    "fat" DECIMAL(5, 2),
    "protein" DECIMAL(5, 2),
    "carbs" DECIMAL(5, 2)
);

CREATE TABLE fridge (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "item_name" VARCHAR(255) NOT NULL,
    "quantity" INT NOT NULL,
    "date_bought" DATE NOT NULL,
    "expiration_date" DATE NOT NULL,
    "calories" INT,
    "fat" DECIMAL(5, 2),
    "protein" DECIMAL(5, 2),
    "carbs" DECIMAL(5, 2)
);
