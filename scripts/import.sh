#!/bin/bash

# Setup database
echo "Force users to quit citysalaries database session..."
psql citysalaries -c "
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = current_database()
  AND pid <> pg_backend_pid();"

echo "Drop citysalaries database if it exists..."
dropdb --if-exists citysalaries

echo "Create citysalaries database..."
createdb citysalaries

# Define database layout
echo "Create employees table..."
# python make_db.py
psql citysalaries -c "
CREATE TABLE employees (
    department_id        varchar(3),
    department_office_id varchar(7),
    last_name            varchar(50),
    first_name           varchar(50),
    middle_name          varchar(50),
    job_id               varchar(50),
    job_title            varchar(100),
    hours                numeric(9, 2),
    salary               numeric(9, 2)  
);"

# echo "Create agency codes table..."
# psql citysalaries -c "
# CREATE TABLE agencies (
#     name          varchar(50),
#     department_id varchar(50) 
# );"

echo "Create office codes table..."
psql citysalaries -c "
CREATE TABLE offices (
    department_id        varchar(3),
    office_id            varchar(4),
    department_office_id varchar(7),
    office_description   varchar(200)
);"

# CSVs that were generated from LDOE's Excel file:

echo "Import salaries.csv to employees table..."
psql citysalaries -c "
COPY employees (department_id, department_office_id, last_name, first_name, middle_name, job_id, job_title, hours, salary)
FROM '$PYTHONPATH/data/intermediate/salaries.csv'
DELIMITER ',' CSV HEADER;"

# echo "Import agency-codes-hand-cleaned.csv to agencies table..."
# psql citysalaries -c "
# COPY agencies (name, code)
# FROM '$PYTHONPATH/data/intermediate/agency-codes-hand-cleaned.csv'
# DELIMITER ',' CSV HEADER;"

echo "Import org-descriptions.csv to offices table..."
psql citysalaries -c "
COPY offices (department_id, office_id, office_description)
FROM '$PYTHONPATH/data/intermediate/org-descriptions.csv'
DELIMITER ',' CSV HEADER;"

echo "Create concatenated department_office_id (department_id + office_id) field in offices table..."
psql citysalaries -c "
UPDATE offices SET department_office_id = department_id || office_id;"
