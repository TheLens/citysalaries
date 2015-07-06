#!/bin/bash

echo "Export employee list to employees.csv..."
psql citysalaries -c "COPY (
    SELECT (first_name || ' ' || middle_name || ' ' || last_name) AS name
    FROM employees
    ORDER BY name ASC
) to '$PYTHONPATH/data/export/employees.csv' WITH CSV HEADER;"
# Don't need to use FORCE QUOTE * because jQuery's Autocomplete reads as text
sed -i '' '1,2d' /Users/thomasthoren/projects/city-salaries/data/export/employees.csv

echo "JOIN employees and agencies tables and export to departments.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT office_description
    FROM offices
    JOIN employees on employees.department_office_id = offices.department_office_id
    ORDER BY office_description ASC
) to '$PYTHONPATH/data/export/departments.csv' WITH CSV HEADER;"
sed -i '' '1,2d' /Users/thomasthoren/projects/city-salaries/data/export/departments.csv

echo "Export job titles to positions.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT job_title
    FROM employees
    ORDER BY job_title ASC
) to '$PYTHONPATH/data/export/positions.csv' WITH CSV HEADER;"
sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/export/positions.csv

echo "Export offices and codes to offices.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT ON (office_description)
        department_id,
        office_id,
        department_office_id,
        office_description
    FROM offices
    ORDER BY office_description ASC
) to '$PYTHONPATH/data/export/offices.csv' WITH CSV HEADER;"
sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/export/positions.csv

echo "JOIN employees and offices tables and export..."
psql citysalaries -c "COPY (
  SELECT e.last_name,
         concat_ws(' ', e.first_name::text, e.middle_name::text) AS first_name,
         e.salary,
         e.job_title AS position,
         o.office_description AS department
  FROM employees AS e
  JOIN (
      SELECT DISTINCT ON (department_office_id)
          department_office_id,
          office_description
      FROM offices
  ) AS o on e.department_office_id = o.department_office_id
) to '$PYTHONPATH/data/export/data.csv' WITH CSV HEADER;"

echo "JOIN employees and departments/offices tables and export to data.csv..."
psql citysalaries -c "COPY (
  SELECT e.last_name,
         concat_ws(' ', e.first_name::text, e.middle_name::text) AS first_name,
         e.salary,
         e.job_title AS position,
         o.office_description AS department
  FROM employees AS e
  JOIN (
      SELECT DISTINCT ON (department_office_id)
          department_office_id,
          office_description
      FROM offices
  ) AS o on e.department_office_id = o.department_office_id
  ORDER BY first_name ASC
) to '$PYTHONPATH/data/export/data.csv' WITH CSV HEADER;"


echo "JOIN employees and departments/offices tables and export highest 25 salaries to highest-paid.csv..."
psql citysalaries -c "COPY (
  SELECT e.last_name,
         concat_ws(' ', e.first_name::text, e.middle_name::text) AS first_name,
         e.salary,
         e.job_title AS position,
         o.office_description AS department
  FROM employees AS e
  JOIN (
      SELECT DISTINCT ON (department_office_id)
          department_office_id,
          office_description
      FROM offices
  ) AS o on e.department_office_id = o.department_office_id
  ORDER BY salary DESC
  LIMIT 25
) to '$PYTHONPATH/data/export/highest-paid.csv' WITH CSV HEADER;"
