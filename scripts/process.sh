#!/bin/bash

# Duplicates
echo "Removing duplicate rows in employees table..."
psql citysalaries -c "
CREATE TEMP TABLE tmp AS SELECT DISTINCT * FROM employees;
TRUNCATE TABLE employees;
INSERT INTO employees SELECT * FROM tmp;"

echo "Removing duplicate rows in offices table..."
psql citysalaries -c "
CREATE TEMP TABLE tmp AS SELECT DISTINCT * FROM offices;
TRUNCATE TABLE offices;
INSERT INTO offices SELECT * FROM tmp;"

# Filling in columns
echo "Create concatenated department_office_id field in offices table..."
psql citysalaries -c "
UPDATE offices
SET department_office_id = department_id || office_id;"

# Alterations and additions to tables
echo "Change department_office_id 7007021 description from 'unknown' to 'Office of Police Secondary Employment'..."
psql citysalaries -c "
UPDATE offices
SET office_description = 'Office of Police Secondary Employment'
WHERE department_office_id = '7007021';"

echo "Convert department_office_id of 892 for Rosalind McCorkle to 8928920/French Market Corporation - Administration."
psql citysalaries -c "
UPDATE employees
SET department_office_id = '8928920'
WHERE department_office_id = '892';"

echo "Add office_description of 'Health Department - Outreach and Enrollment' for department_office_id = 3603623 ('Health Project & Planning Analysts)..."
psql citysalaries -c "
INSERT INTO offices (
  department_id,
  office_id,
  department_office_id,
  office_description
)
VALUES (
  '360',
  '3623',
  '3603623',
  'Health Department - Outreach and Enrollment'
);"

echo "Create custom office_description of 'Police Department - Miscellaneous' for department_office_id = 2702723 ('Police Community Services Specialist')..."
psql citysalaries -c "
INSERT INTO offices (
  department_id,
  office_id,
  department_office_id,
  office_description
)
VALUES (
  '270',
  '2723',
  '2702723',
  'Police Department - Miscellaneous'
);"

echo "Create custom office_description of 'Miscellaneous - Code Enforcement' for department_office_id = 7007040 ('Code Enforcement Inspector/Specialist')..."
psql citysalaries -c "
INSERT INTO offices (
  department_id,
  office_id,
  department_office_id,
  office_description
)
VALUES (
  '700',
  '7040',
  '7007040',
  'Miscellaneous - Code Enforcement'
);"

echo "Add missing office_description of 'Housing and Urban Development - Demolition Program Administration' for department_office_id = 7507608 ('Disaster Recovery Prog Assistant II')..."
psql citysalaries -c "
INSERT INTO offices (
  department_id,
  office_id,
  department_office_id,
  office_description
)
VALUES (
  '750',
  '7608',
  '7507608',
  'Housing and Urban Development - Demolition Program Administration'
);"

echo "Add missing office_description of 'Mayor's Office - Substance Abuse Coordination' for department_office_id = 2102105 ('Orleans Criminal Justice Coordination Transition Specialist')..."
psql citysalaries -c "
INSERT INTO offices (
  department_id,
  office_id,
  department_office_id,
  office_description
)
VALUES (
  '210',
  '2105',
  '2102105',
  'Mayor''s Office - Substance Abuse Coordination'
);"

echo "Tanya Jones' office says National Endowment for the Arts in the budget book, but she actually works for The Network for Economic Opportunity. Other employees who also work there are listed under Mayor's Office - Office of the Mayor, so we'll go with that instead. Change department_office_id code to that so we don't have duplicate codes for the same office. She might be funded through NEA, but her job description doesn't match that."
psql citysalaries -c "
UPDATE employees
SET department_office_id = '2102101'
WHERE department_office_id = '2102160';"

echo "Add missing office_description of 'Inspector General - Justice System Funding Evaluation' for department_office_id = 7107108 ('Inspection and Evaluation Associate (Inspector General)')..."
psql citysalaries -c "
INSERT INTO offices (
  department_id,
  office_id,
  department_office_id,
  office_description
)
VALUES (
  '710',
  '7108',
  '7107108',
  'Inspector General - Justice System Funding Evaluation'
);"
