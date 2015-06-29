# -*- coding: utf-8 -*-

'''The controller that routes requests and returns responses.'''

from flask import (
    Flask,
    render_template,
    make_response
)
from citysalaries import (
    BANNER_CSS,
    CITY_SALARIES_CSS,
    LENS_CSS,
    CITY_SALARIES_JS,
    INDEX_JS,
    LENS_JS
)

app = Flask(__name__)


@app.route("/citysalaries/", methods=['GET'])
def home():
    '''
    Receives a GET call for the homepage (/) and returns the view.
    '''

    response = make_response(
        render_template(
            'index.html',
            banner_css=BANNER_CSS,
            citysalaries_css=CITY_SALARIES_CSS,
            lens_css=LENS_CSS,
            citysalaries_js=CITY_SALARIES_JS,
            index_js=INDEX_JS,
            lens_js=LENS_JS
        )
    )

    return response

if __name__ == '__main__':
    app.run(
        port=5000,
        use_reloader=True,
        debug=True
    )
