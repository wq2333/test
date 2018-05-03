
import tornado.web
from tornado.options import options

import pymongo
from pymongo import MongoClient

import setting

from PIL import Image
import io
import os.path

import json

import subprocess

from scipy import stats
import numpy as np
from skimage import measure

class KDEHandler(tornado.web.RequestHandler):
	def post(self):
		self.set_header('Access-Control-Allow-Origin', "*")
		clusterNum = json.loads(self.get_argument('cluster'));
		
		print('clusterNum', clusterNum)

		xmin=-6
		xmax=6
		ymin=-6
		ymax=6
		
		m1,m2 = self.measure1(2000)
		m3,m4 = self.measure(2000)

		liDot1 = self.listZip(m1, m2)
		liDot2 = self.listZip(m3, m4)

		Z1 = self.kde(m1, m2)
		Z2 = self.kde(m3, m4)

		liDensity1 = list(Z1.ravel()) #self.kde(m1, m2)
		liDensity2 = list(Z2.ravel()) #self.kde(m3, m4)
		# list(np.rot90(Z).ravel());

		mapContour1 = self.getContours(Z1)
		mapContour2 = self.getContours(Z2)

		liCluster = []
		liCluster.append({
			'dots': liDot1,
			'densitys': liDensity1,
			'mindensity': Z1.ravel().min(),
			'maxdensity': Z1.ravel().max(),
			'contours': mapContour1
			})

		liCluster.append({
			'dots': liDot2,
			'densitys': liDensity2,
			'mindensity': Z2.ravel().min(),
			'maxdensity': Z2.ravel().max(),
			'contours': mapContour2
			})

		self.write({'clusters': liCluster, 'mm': [xmin, xmax, ymin, ymax]})

	def listZip(self, m1, m2):
		list1 = list(m1)
		list2 = list(m2)
		return list(zip(list1, list2))

	def measure1(self, n):
		m1 = np.random.normal(size=n)
		m2 = np.random.normal(scale=0.5, size=n)
		return 2 + m1-m2, -1 + (m1+m2)

	def measure(self, n):
	    m1 = np.random.normal(size=n)
	    m2 = np.random.normal(scale=0.5, size=n)
	    return 2 + m1-m2, - (m1+m2)

	def kde(self, m1, m2):	
		xmin=-6
		xmax=6
		ymin=-6
		ymax=6
		X, Y = np.mgrid[xmin:xmax:100j, ymin:ymax:100j]
		positions = np.vstack([X.ravel(), Y.ravel()])
		values = np.vstack([m1,m2])
		kernel = stats.gaussian_kde(values)
		Z = np.reshape(kernel(positions).T, X.shape)
		print(' shape Z ', Z.shape)
		return np.rot90(Z)

	def getContours(self, Z):		
		mapIsoValueContours = {}
		isoPosNum = 20
		baseValue = 1e-12
		littleContour = [1e-10, 1e-5, 1e-3]
		liIsoValue = []
		minDensity = Z.ravel().min()
		maxDensity = Z.ravel().max()		
		liIsoValue.append(1e-1)
		# for i in range(0, isoNegNum):
		# 	liIsoValue.append(minDensity + i * (baseValue-minDensity)/isoNegNum)
		for i in range(0, isoPosNum):
			liIsoValue.append(baseValue + i * (maxDensity-baseValue)/isoPosNum)
		for i in range(0, len(littleContour)):
			liIsoValue.append(littleContour[i])
		for i in range(0, len(liIsoValue)):
			contours = measure.find_contours(Z, liIsoValue[i])
			isoValue = liIsoValue[i]
			liContours = [];
			for n, contour in enumerate(contours):
				contour = contour.tolist();
				liContours.append(contour);
			mapIsoValueContours[str(isoValue)] = liContours
		return mapIsoValueContours;

	

