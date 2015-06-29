
'''Generates CSV files from Excel file. Cleans CSV files.'''

import csv
import xlrd
from citysalaries import PROJECT_DIR
from citysalaries.lib.utilities import make_headers, clean_data


def main():
    '''docstring'''

    import_file = "%s/data/raw/activemay3precords.xls" % PROJECT_DIR

    workbook = xlrd.open_workbook(import_file)
    # datemode = workbook.datemode
    worksheets = workbook.sheet_names()

    headers = make_headers(workbook.sheet_by_name(worksheets[0]))

    # with open(file_location, 'w') as filename:
    #     filename.write(html)

    file_path = "%s/data/intermediate/salaries.csv" % PROJECT_DIR

    with open(file_path, "w") as filename:
        writer = csv.DictWriter(filename, fieldnames=headers.values())
        writer.writeheader()
        sheet = workbook.sheet_by_name(worksheets[0])
        clean_data(sheet, writer, headers)

if __name__ == '__main__':
    main()
