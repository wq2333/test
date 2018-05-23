#!/usr/bin/env python
#coding:utf-8

import sys
# from imp import reload
# reload(sys)
# sys.setdefaultencoding('utf-8')

from handler.pointhandler import IndexHandler
from handler.pointhandler import TestHandler
from handler.odhandler import DataHandler
from handler.odhandler import ChartHandler
from handler.odhandler import PurposeHandler
from handler.odhandler import PClusterHandler
from handler.hwhandler import HWHandler
from handler.hwhandler import ActHandler

from handler.kdehandler import KDEHandler

url=[
	(r'/', IndexHandler),
    (r'/test/(\w+)', TestHandler),
    (r'/window5', DataHandler),
    (r'/window4', HWHandler),
    (r'/window43', ActHandler),
    (r'/chart', ChartHandler),
    (r'/purpose', PurposeHandler),
    (r'/pCluster', PClusterHandler),


    # (r'/clusterKDE', KDEHandler),
]