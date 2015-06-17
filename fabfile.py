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


def js():
    '''/css'''

    local('git add js/city-salaries.js')


def txt():
    '''/css'''

    local('git add txt/departments.txt')
    local('git add txt/positions.txt')


def addthemall():
    '''Run through entire deployment.'''

    repo()
    css()
    js()
    txt()


def push():
    local('git push origin development')


def pull():
    local('git pull origin development')
