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
    local('git add index.html')
    local('git add README.md')


def css():
    '''/css'''

    local('git add css/city-salaries.css')
    local('git add css/lens.css')


def data():
    '''/data/export/'''

    local('git add data/export/data.csv')
    local('git add data/export/departments.csv')
    local('git add data/export/employees.csv')
    local('git add data/export/positions.csv')


def js():
    '''/css'''

    local('git add js/city-salaries.js')


def addthemall():
    '''Run through entire deployment.'''

    repo()
    css()
    data()
    js()


def push():
    local('git push origin development')


def pull():
    local('git pull origin development')
