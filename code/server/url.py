#!/usr/bin/env python
#coding:utf-8

import sys
# from imp import reload
# reload(sys)
# sys.setdefaultencoding('utf-8')

from handler.pointhandler import IndexHandler
from handler.pointhandler import TestHandler
from handler.odhandler import DataHandler

from handler.kdehandler import KDEHandler

url=[
	(r'/', IndexHandler),
    (r'/test/(\w+)', TestHandler),
    (r'/window3', DataHandler)

    # (r'/clusterKDE', KDEHandler),
]