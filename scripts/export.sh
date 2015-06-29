#!/bin/bash

echo "JOIN employees and agencies tables and export..."
psql citysalaries -c "COPY (
  SELECT e.last_name,
         e.first_name,
         e.middle_name,
         e.salary,
         e.job_title AS position,
         a.name AS department
  FROM employees AS e
  JOIN agencies AS a on e.office_id = a.code
) to '$PYTHONPATH/data/export/data.csv' WITH CSV HEADER;"

echo "JOIN employees and agencies tables and export highest 25 salaries..."
psql citysalaries -c "COPY (
  SELECT e.last_name,
         e.first_name,
         e.middle_name,
         e.salary,
         e.job_title AS position,
         a.name AS department
  FROM employees AS e
  JOIN agencies AS a on e.office_id = a.code
  ORDER BY salary DESC
  LIMIT 25
) to '$PYTHONPATH/data/export/highest-paid.csv' WITH CSV HEADER;"

echo "Export employee list for employees.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT first_name || ' ' || middle_name || ' ' || last_name
    FROM employees
) to '$PYTHONPATH/data/export/employees.csv';"
sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/export/employees.csv  # TODO: Not sure if '' is necessary or if it will work on Linux.

echo "JOIN employees and agencies tables and export distinct agency names for departments.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT name
    FROM agencies
    JOIN employees on employees.office_id = agencies.code
) to '$PYTHONPATH/data/export/departments.csv';"
sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/export/departments.csv

echo "Export distinct employee job titles for positions.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT job_title
    FROM employees
) to '$PYTHONPATH/data/export/positions.csv';"
sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/export/positions.csv
