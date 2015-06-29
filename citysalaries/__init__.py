#!/usr/bin/python

"""
Holds the settings so that they are accessible to other classes.
All private information is stored in environment variables and should never
be written into files in this repo.
"""

import os
import getpass


USER = getpass.getuser()
PROJECT_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..'))

PROJECT_URL = 'http://vault.thelensnola.org/city-salaries'
S3_URL = 'https://s3-us-west-2.amazonaws.com/lensnola/city-salaries'

DATA_DIR = '%s/data' % PROJECT_DIR

# CSS
BANNER_CSS = '/static/css/banner.css'
CITY_SALARIES_CSS = '/static/css/city-salaries.css'
LENS_CSS = '/static/css/lens.css'

BANNER_CSS_RENDER = 'css/banner.css'
CITY_SALARIES_CSS_RENDER = 'css/city-salaries.css'
LENS_CSS_RENDER = 'css/lens.css'

# JavaScript
CITY_SALARIES_JS = '/static/js/city-salaries.js'
INDEX_JS = '/static/js/index.js'
LENS_JS = '/static/js/lens.js'
SEARCH_JS = '/static/js/search.js'

CITY_SALARIES_JS_RENDER = 'js/city-salaries.js'
INDEX_JS_RENDER = 'js/index.js'
LENS_JS_RENDER = 'js/lens.js'
SEARCH_JS_RENDER = 'js/search.js'
