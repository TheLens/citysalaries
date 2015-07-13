#!/bin/bash

source `which virtualenvwrapper.sh`

workon city-salaries

echo ""
echo "Preparing data..."
echo "-----------------"
python $PYTHONPATH/citysalaries/lib/prepare_data.py

echo ""
echo "Building database and importing data..."
echo "---------------------------------------"
bash $PYTHONPATH/scripts/import.sh

echo ""
echo "Processing data..."
echo "------------------"
bash $PYTHONPATH/scripts/process.sh

echo ""
echo "Exporting data..."
echo "-----------------"
bash $PYTHONPATH/scripts/export.sh

echo ""
echo "Comparing data from before and after maniuplations and exports..."
echo "-----------------------------------------------------------------"
bash $PYTHONPATH/scripts/check.sh

python $PYTHONPATH/citysalaries/lib/render_html.py

deactivate
