# -*- coding: utf-8 -*-

'''
Methods for commiting app to Github.
It should never deploy to the server or S3.
That should be left to Travis CI and the server calling git pull.
'''

from fabric.api import local


def repo():
    '''/'''

    local('git add .gitignore')
    local('git add .travis.yml')
    local('git add fabfile.py')
    local('git add README.md')
    local('git add requirements.txt')


def citysalaries():
    '''/citysalaries'''

    local('git add citysalaries/__init__.py')


def lib():
    '''/lib'''

    local('git add citysalaries/lib/clean.py')
    local('git add citysalaries/lib/prepare_data.py')
    local('git add citysalaries/lib/render_html.py')
    local('git add citysalaries/lib/utilities.py')


def static():
    '''/static'''

    local('git add citysalaries/static/index.html')


def css():
    '''/css'''

    local('git add citysalaries/static/css/banner.css')
    local('git add citysalaries/static/css/city-salaries.css')
    local('git add citysalaries/static/css/index.css')
    local('git add citysalaries/static/css/lens.css')
    local('git add citysalaries/static/css/search.css')


def js():
    '''/js'''

    local('git add citysalaries/static/js/city-salaries.js')
    local('git add citysalaries/static/js/index.js')
    local('git add citysalaries/static/js/lens.js')
    local('git add citysalaries/static/js/search.js')


def templates():
    '''/templates'''

    local('git add citysalaries/templates/404.html')
    local('git add citysalaries/templates/banner.html')
    local('git add citysalaries/templates/foot-note.html')
    local('git add citysalaries/templates/head.html')
    local('git add citysalaries/templates/index.html')
    local('git add citysalaries/templates/js.html')
    local('git add citysalaries/templates/search-area.html')
    local('git add citysalaries/templates/search.html')
    local('git add citysalaries/templates/table.html')


def data():
    '''/data/export/'''

    local('git add data/export/data.csv')
    local('git add data/export/departments.csv')
    local('git add data/export/employees.csv')
    local('git add data/export/highest-paid.csv')
    local('git add data/export/positions.csv')


def scripts():
    '''/scripts/'''

    local('git add scripts/export.sh')
    local('git add scripts/import.sh')
    local('git add scripts/main.sh')


def addthemall():
    '''Run through entire deployment.'''

    repo()
    citysalaries()
    lib()
    static()
    css()
    js()
    templates()
    data()
    scripts()


def push():
    local('git push origin development')


def pull():
    local('git pull origin development')
