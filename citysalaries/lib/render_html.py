# -*- coding: utf-8 -*-

'''The controller that routes requests and returns responses.'''

from jinja2 import (
    Environment,
    FileSystemLoader
)
from citysalaries import (
    PROJECT_DIR,
    BANNER_CSS_RENDER,
    CITY_SALARIES_CSS_RENDER,
    LENS_CSS_RENDER,
    CITY_SALARIES_JS_RENDER,
    INDEX_JS_RENDER,
    LENS_JS_RENDER,
    SEARCH_JS_RENDER
)


class Render(object):

    '''docstring'''

    def __init__(self):
        '''docstring'''

        self.render_index_html()
        self.render_search_html()

    def render_index_html(self):
        env = Environment(loader=FileSystemLoader(
            '%s/citysalaries/templates' % PROJECT_DIR))
        template = env.get_template('index.html')

        output = template.render(
            banner_css=BANNER_CSS_RENDER,
            citysalaries_css=CITY_SALARIES_CSS_RENDER,
            lens_css=LENS_CSS_RENDER,
            citysalaries_js=CITY_SALARIES_JS_RENDER,
            index_js=INDEX_JS_RENDER,
            lens_js=LENS_JS_RENDER
        )

        file_path = "%s/citysalaries/static/index.html" % PROJECT_DIR

        with open(file_path, "wb") as index_file:
            index_file.write(output)

    def render_search_html(self):
        env = Environment(loader=FileSystemLoader(
            '%s/citysalaries/templates' % PROJECT_DIR))
        template = env.get_template('search.html')

        output = template.render(
            banner_css=BANNER_CSS_RENDER,
            citysalaries_css=CITY_SALARIES_CSS_RENDER,
            lens_css=LENS_CSS_RENDER,
            citysalaries_js=CITY_SALARIES_JS_RENDER,
            lens_js=LENS_JS_RENDER,
            search_js=SEARCH_JS_RENDER
        )

        file_path = "%s/citysalaries/static/search.html" % PROJECT_DIR

        with open(file_path, "wb") as search_file:
            search_file.write(output)

if __name__ == '__main__':
    Render()
