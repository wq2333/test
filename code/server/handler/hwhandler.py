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


class HWHandler(tornado.web.RequestHandler):
    def post(self):
        va = self.get_argument('value')
        userId = va.split(',')

        ods41 = {}
        ods42 = {}
        ods41, ods42 = self.getCount(userId)

        max = 0;
        for key in ods41.keys():
            temp = ods41.get(key)
            if(temp>max):
                max = temp
        for key2 in ods42.keys():
            temp2 = ods42.get(key2)
            if(temp2>max):
                max = temp2

        stringnumber41 = '['
        flag = 1
        for key3 in ods41.keys():
            if flag==1:
                stringnumber41 += "{\"id\":"+str(key3)+", \"n\":"+str(ods41.get(key3))+"}"
                flag = 2
            else:
                stringnumber41 += ",{\"id\":" + str(key3) + ", \"n\":" + str(ods41.get(key3)) + "}"
        stringnumber41 += "]"

        stringnumber42 = '['
        flag = 1
        for key4 in ods42.keys():
            if flag == 1:
                stringnumber42 += "{\"id\":" + str(key4) + ", \"n\":" + str(ods42.get(key4)) + "}"
                flag = 2
            else:
                stringnumber42 += ",{\"id\":" + str(key4) + ", \"n\":" + str(ods42.get(key4)) + "}"
        stringnumber42 += "]"

        result = {'r1': stringnumber41, 'r2': stringnumber42, 'max': max}
        #print(result);
        self.set_header('Access-Control-Allow-Origin', '*')
        self.write(result)

    def getCount(self, uidsinput):

        mongo_url = "192.168.153.139:27017"
        client = pymongo.MongoClient(mongo_url);
        db = client['wechat']
        collection = db["userbid"]

        ods1 = {}
        ods2 = {}
        for j in range(len(uidsinput)):
            cursor = collection.find({"uid": uidsinput[j]})

            for item in cursor:
                h = item['homebid']
                if (h in ods1):
                    temp = ods1.get(h)
                    ods1[h] = temp + 1
                else:
                    ods1[h] = 1

                w = item['companybid']
                if (w in ods2):
                    temp = ods2.get(w)
                    ods2[w] = temp + 1
                else:
                    ods2[w] = 1

        return ods1, ods2



class ActHandler(tornado.web.RequestHandler):
    def post(self):
        va = self.get_argument('value')
        userId = va.split(',')

        ods = {}
        ods, max = self.getCount(userId)

        stringnumber = '['
        flag = 1
        for key in ods.keys():
            if flag==1:
                stringnumber += "{\"id\":"+str(key)+", \"n\":"+str(ods.get(key))+"}"
                flag = 2
            else:
                stringnumber += ",{\"id\":" + str(key) + ", \"n\":" + str(ods.get(key)) + "}"
        stringnumber += "]"

        result = {'result': stringnumber, 'max' : max}
        #print(result);
        self.set_header('Access-Control-Allow-Origin', '*')
        self.write(result)

    def getCount(self, uidsinput):

        mongo_url = "192.168.153.139:27017"
        client = pymongo.MongoClient(mongo_url);
        db = client['wechat']
        collection = db["od"]
        ods = {}
        for j in range(len(uidsinput)):
            cursor = collection.find({"uid": uidsinput[j]})

            for item in cursor:
                ebid = item["ebid"]
                mul = item["multiple"]
                if (ebid in ods):
                    temp = ods.get(ebid)
                    ods[ebid] = temp + mul
                else:
                    ods[ebid] = mul

        max = 0;
        for key in ods.keys():
            temp = ods.get(key)
            ods[key] = round(temp)
            if round(temp)> max:
                max = round(temp)

        return ods, max
