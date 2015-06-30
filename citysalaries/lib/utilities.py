# -*- coding: utf-8 -*-

'''docstring'''

from citysalaries.lib.clean import Clean
from slugify import slugify


def make_headers(worksheet):
    '''Make headers.'''

    headers = {}
    cell_id = 0
    row_id = 0

    while cell_id < worksheet.ncols:
        cell_type = worksheet.cell_type(row_id, cell_id)
        cell_value = worksheet.cell_value(row_id, cell_id)
        cell_value = str(slugify(cell_value).replace('-', '_')).strip()

        if cell_type == 1:  # If unicode

            if cell_value == 'home_agcy':
                cell_value = 'department'
            elif cell_value == 'department_id_job_dta':
                cell_value = 'department_id'
            elif cell_value == 'job_code_job_dta':
                cell_value = 'job_code'
            elif cell_value == 'description_position_dta':
                cell_value = 'job_title'
            elif cell_value == 'standard_hours_job_dta':
                cell_value = 'hours'
            elif cell_value == 'annual_rate_job_dta':
                cell_value = 'salary'

            headers[cell_id] = cell_value

        cell_id += 1

    return headers


def clean_data(worksheet, writer, headers):
    '''docstring'''

    row_id = 1
    while row_id < worksheet.nrows:  # For each row...
        cell_id = 0
        row_dict = {}
        while cell_id < worksheet.ncols:  # For each column in this row...
            try:
                header = headers[cell_id]  # Not sure why try/except necessary
            except KeyError:
                cell_id += 1
                continue

            # Convert cells to correct data types
            try:
                # Strings
                cell_value = worksheet.cell_value(row_id, cell_id).strip()
                cell_value = str(cell_value)
            except AttributeError:
                # Numbers, so take as is
                cell_value = worksheet.cell_value(row_id, cell_id)

            # Title case for names
            if '_name' in header:
                cell_value = cell_value.title()

            if header == 'job_title':
                cell_value = cell_value.title()
                # cell_value = Clean().job_titles_only(cell_value)
            else:
                # Correct things like Iii, Jr, Iv, etc.
                cell_value = Clean().all(cell_value)

            # Confirmed by Robert Hagmann
            police_codes = [
                'C5250',
                'C5251',
                'C5252',
                'C5253',
                'C5254',
                'C7108',
                'C7109',
                'C7110',
                'C7111',
                'C7112',
                'C7113',
                'C7122',
                'C7132',
                'C7133',
                'C7134',
                'C7155',
                'C7166',
                'C7167',
                'C7168',
                'C7175'
            ]

            fire_codes = [
                'C2270',
                'C2271',
                'C2272',
                'C2274',
                'C2275',
                'C2276',
                'C7205',
                'C7209',
                'C7210',
                'C7211',
                'C7215',
                'C7220',
                'C7221',
                'C7222',
                'C7223',
                'C7300',
                'C7301',
                'C7302',
                'C7304',
                'C7305'
            ]

            # Salary adjustments, from Robert Hagmann
            if header == 'salary':
                cell_value = float(cell_value)

                if row_dict['job_code'] in police_codes:  # Checking job codes
                    cell_value += 2921  # City millage
                    cell_value += 6000  # State millage

                if row_dict['job_code'] in fire_codes:  # Checking job codes
                    cell_value += 4020  # City millage
                    cell_value += 6000  # State millage
                    cell_value += 288.08  # ADP software

            row_dict[header] = cell_value
            cell_id += 1

        writer.writerow(row_dict)
        row_id += 1
