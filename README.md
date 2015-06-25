# City of New Orleans employee salaries

[![Build Status](https://travis-ci.org/TheLens/citysalaries.svg)](https://travis-ci.org/TheLens/citysalaries)

Deployment and tests: [travis-ci.org/TheLens/citysalaries](https://travis-ci.org/TheLens/citysalaries)

The salaries of the 4,663 full- and part-time employees who work for the City of New Orleans.


### Parsing and cleaning data

`main.sh`

This calls the following files, in order:

`main.py`

Reads the raw .xls file, runs utility functions using `util.py` (splits name fields, renames column headers), cleans using `clean.py` (converts to title case, corrects for misspellings and things like III/Jr.) and ultimately outputs a .csv file.

`import.sh`

Creates a PostgreSQL database and imports the .csv file into one table and imports the agency codes .csv file into another table.

`export.sh`

JOINs the two database tables before exporting the results as a new .csv file.
