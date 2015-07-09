#!/bin/bash

# echo "Export employee list to employees.csv..."
# psql citysalaries -c "COPY (
#     SELECT (first_name || ' ' || middle_name || ' ' || last_name) AS name
#     FROM employees
#     ORDER BY name ASC
# ) to '$PYTHONPATH/data/intermediate/employees.csv' WITH CSV HEADER;"
# Don't need to use FORCE QUOTE * because this is converted to .txt later
# sed -i '' '1,2d' /Users/thomasthoren/projects/city-salaries/data/intermediate/employees.csv

# echo "Export offices and codes to offices.csv for internal purposes..."
# psql citysalaries -c "COPY (
#     SELECT DISTINCT ON (office_description)
#         department_id,
#         office_id,
#         department_office_id,
#         office_description
#     FROM offices
#     ORDER BY office_description ASC
# ) to '$PYTHONPATH/data/export/offices.csv' WITH CSV HEADER;"
# sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/export/offices.csv

echo "JOIN employees and offices tables and export to departments.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT office_description
    FROM offices
    JOIN employees on employees.department_office_id = offices.department_office_id
    ORDER BY office_description ASC
) to '$PYTHONPATH/data/intermediate/departments.csv' WITH CSV HEADER;"
sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/intermediate/departments.csv

echo "Export job titles to positions.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT job_title
    FROM employees
    ORDER BY job_title ASC
) to '$PYTHONPATH/data/intermediate/positions.csv' WITH CSV HEADER;"
sed -i '' 1d /Users/thomasthoren/projects/city-salaries/data/intermediate/positions.csv

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

echo "JOIN employees and offices tables and export highest 25 salaries to highest-paid.csv..."
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

echo "Changing .csv files to .txt files..."
cp $PYTHONPATH/data/intermediate/departments.csv $PYTHONPATH/data/export/departments.txt
# cp $PYTHONPATH/data/intermediate/employees.csv $PYTHONPATH/data/export/employees.txt
cp $PYTHONPATH/data/intermediate/positions.csv $PYTHONPATH/data/export/positions.txt

echo "Removing double quotes in .txt files..."
sed -i '' 's/^"//g' $PYTHONPATH/data/export/departments.txt
sed -i '' 's/"$//g' $PYTHONPATH/data/export/departments.txt

sed -i '' 's/^"//g' $PYTHONPATH/data/export/positions.txt
sed -i '' 's/"$//g' $PYTHONPATH/data/export/positions.txt

echo "Deleting empty lines in .txt files..."
echo "NOTE: This won't catch any newline characters at the end of the files!"
sed -i '' '/^$/d' $PYTHONPATH/data/export/departments.txt
sed -i '' '/^$/d' $PYTHONPATH/data/export/positions.txt
