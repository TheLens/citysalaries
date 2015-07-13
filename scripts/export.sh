#!/bin/bash

echo "Export employees' offices to offices.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT offices.office_description
    FROM offices
    INNER JOIN employees ON offices.department_office_id = employees.department_office_id
    ORDER BY offices.office_description ASC
) to '$PYTHONPATH/data/intermediate/offices.csv' WITH CSV HEADER;"
sed -i '' 1d $PYTHONPATH/data/intermediate/offices.csv

echo "Export employees' job titles to positions.csv..."
psql citysalaries -c "COPY (
    SELECT DISTINCT job_title
    FROM employees
    ORDER BY job_title ASC
) to '$PYTHONPATH/data/intermediate/positions.csv' WITH CSV HEADER;"
sed -i '' 1d $PYTHONPATH/data/intermediate/positions.csv

echo "Export final output with employees, salaries and job title information to data.csv..."
psql citysalaries -c "COPY (
  SELECT e.last_name,
         concat_ws(' ', e.first_name::text, e.middle_name::text) AS first_name,
         e.salary,
         e.job_title AS position,
         o.office_description
  FROM employees AS e
  LEFT OUTER JOIN (
    SELECT DISTINCT ON (department_office_id)
      department_office_id,
      office_description
    FROM offices
  ) AS o ON e.department_office_id = o.department_office_id
) to '$PYTHONPATH/data/export/data.csv' WITH CSV HEADER;"

echo "Find the highest 25 salaries from data table and export to highest-paid.csv..."
psql citysalaries -c "COPY (
  SELECT e.last_name,
         concat_ws(' ', e.first_name::text, e.middle_name::text) AS first_name,
         e.salary,
         e.job_title AS position,
         o.office_description
  FROM employees AS e
  LEFT OUTER JOIN (
    SELECT DISTINCT ON (department_office_id)
      department_office_id,
      office_description
    FROM offices
  ) AS o ON e.department_office_id = o.department_office_id
  ORDER BY salary DESC
  LIMIT 25
) to '$PYTHONPATH/data/export/highest-paid.csv' WITH CSV HEADER;"

echo "Copying .csv files to .txt files..."
cp $PYTHONPATH/data/intermediate/offices.csv $PYTHONPATH/data/export/offices.txt
cp $PYTHONPATH/data/intermediate/positions.csv $PYTHONPATH/data/export/positions.txt

echo "Removing double quotes in .txt files..."
# Linux (GNU) and Mac (BSD) compatible sed commands:
sed -i.bak 's/^"//g' $PYTHONPATH/data/export/offices.txt
sed -i.bak 's/"$//g' $PYTHONPATH/data/export/offices.txt

sed -i.bak 's/^"//g' $PYTHONPATH/data/export/positions.txt
sed -i.bak 's/"$//g' $PYTHONPATH/data/export/positions.txt

echo "Deleting empty lines in .txt files..."
sed -i.bak '/^$/d' $PYTHONPATH/data/export/offices.txt
sed -i.bak '/^$/d' $PYTHONPATH/data/export/positions.txt

echo "Removing newline characters at the end of .txt files..."
# Find byte size of file, subtract 1 (for end of line character), then redirect everything up until that last byte to a temporary .bak file
head -c $(wc -c $PYTHONPATH/data/export/offices.txt | awk '{print $1 - 1}') $PYTHONPATH/data/export/offices.txt > $PYTHONPATH/data/export/offices.bak
head -c $(wc -c $PYTHONPATH/data/export/positions.txt | awk '{print $1 - 1}') $PYTHONPATH/data/export/positions.txt > $PYTHONPATH/data/export/positions.bak

cat $PYTHONPATH/data/export/offices.bak > $PYTHONPATH/data/export/offices.txt
cat $PYTHONPATH/data/export/positions.bak > $PYTHONPATH/data/export/positions.txt

echo "Deleting temporary .bak files..."
rm $PYTHONPATH/data/export/*.bak
