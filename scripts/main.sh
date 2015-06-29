#!/bin/bash

source `which virtualenvwrapper.sh`

workon city-salaries

python $PYTHONPATH/citysalaries/lib/prepare_data.py
bash $PYTHONPATH/scripts/import.sh
bash $PYTHONPATH/scripts/export.sh
python $PYTHONPATH/citysalaries/lib/render_html.py

deactivate
