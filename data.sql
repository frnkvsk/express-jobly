\c jobly_test

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS companies;

/*
Create a table for companies, each company should have a:

handle: a primary key that is text
name: a non-nullable column that is text and unique
num_employees: a column that is an integer
description: a column that is text
logo_url: a column that is text
*/


CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  num_employees integer,
  description text,
  logo_url text
);

/*
Add a table for jobs, each job should have an:

id: a primary key that is an auto incrementing integer
title: a non-nullable column
salary a non-nullable floating point column
equity: a non-nullable column that is a float. For example, 0.5 equity represents 50% in a company. Ensure that you have a constraint that does not allow for equity to be greater than 1 when created.
company_handle: a column which is a foreign key to the handle column
date_posted: a datetime column that defaults to whenever the row is created
*/


CREATE TABLE jobs (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  salary numeric(10,2) NOT NULL, 
  equity numeric(2,1) CHECK(equity < 1) NOT NULL,
  company_handle text REFERENCES companies (handle),
  date_posted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
/*
Create a table for users, each user should have a:

username: a primary key that is text
password: a non-nullable column
first_name: a non-nullable column
last_name: a non-nullable column
email: a non-nullable column that is and unique
photo_url: a column that is text
is_admin: a column that is not null, boolean and defaults to false
*/


CREATE TABLE users (
  username text PRIMARY KEY,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  photo_url text,
  is_admin boolean DEFAULT 'f'
);