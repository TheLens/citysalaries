#!/bin/bash

echo ""
echo "Employees"
echo "---------"
echo "Number of employees in employees table:"
psql citysalaries -c "
SELECT COUNT(*)
FROM employees;"

echo "Number of lines in data.txt:"
# Subtract 1 for header row:
cat $PYTHONPATH/data/export/data.csv | wc -l | awk '{print $1 - 1}'

echo ""
echo "Offices"
echo "-------"
echo "Number of unique offices in employees table:"
psql citysalaries -c "
SELECT COUNT(*)
FROM (
  SELECT DISTINCT department_office_id
  FROM employees
) AS temp;"

echo "Number of lines in offices.txt..."
cat $PYTHONPATH/data/export/offices.txt | wc -l | awk '{print $1}'

echo ""
echo "Positions"
echo "---------"
echo "Number of unique positions in employees table:"
psql citysalaries -c "
SELECT COUNT(*)
FROM (
  SELECT DISTINCT job_title
  FROM employees
) AS temp;"

echo "Number of lines in positions.txt..."
cat $PYTHONPATH/data/export/positions.txt | wc -l | awk '{print $1}'
