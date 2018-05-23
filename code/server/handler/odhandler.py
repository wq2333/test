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


class ChartHandler(tornado.web.RequestHandler):
    def post(self):
        va = self.get_argument('value');
        st = int(self.get_argument('st'));
        et = int(self.get_argument('et'));
        ebid = int(self.get_argument('ebid'));
        userId = va.split(',')

        ods = {}
        sumtrips = 0
        ods, sumtrips = self.getpurpose(userId, st, et, ebid)

        stringnumber = '['
        flag = 1
        for key in ods.keys():
            if flag==1:
                stringnumber += "{\"x\":"+str(key)+", \"y\":"+str(ods.get(key)*100//sumtrips)+"}"
                flag = 2
            else:
                stringnumber += ",{\"x\":" + str(key) + ", \"y\":" + str(ods.get(key)*100//sumtrips) + "}"
        stringnumber += "]"

        result = {'number': stringnumber}
        #print(result);
        self.set_header('Access-Control-Allow-Origin', '*');
        self.write(result);

    def getpurpose(self, uidsinput, time1, time2, ebid):

        mongo_url = "192.168.153.139:27017"
        client = pymongo.MongoClient(mongo_url);
        db = client['wechat']

        collection = db["od"]
        ods = {}
        for j in range(len(uidsinput)):
            cursor = collection.find({"uid": uidsinput[j]})

            for item in cursor:
                t = item['endminute']
                bid = item['ebid']
                p = item['purpose']

                if (t >= time1) and (t <= time2) and (bid == ebid):
                    if (p in ods):
                        temp = ods.get(p)
                        ods[p] = temp + 1
                    else:
                        ods[p] = 1

        sumod = 0
        for value in ods.values():
            sumod = sumod + value

        return ods, round(sumod)



class DataHandler(tornado.web.RequestHandler):
    def post(self):
        va = self.get_argument('value');
        st = int(self.get_argument('st'));
        et = int(self.get_argument('et'));
        userId = va.split(',')

        ods = {}
        sumtrips = 0
        ods, sumtrips, max = self.get_trips(userId, st, et)
        #ods2 = dict(sorted(ods.items(), key=lambda e: e[1], reverse=True))
        avg = sumtrips // len(ods)
        #print("avg", avg)

        #clustered = self.clusterDBSCAN(ods2, avg)
        #print('clusters', len(clustered))

        stringnumber = '['
        flag = 1
        for key in ods.keys():
            if flag==1:
                stringnumber += "{\"id\":"+str(key)+", \"n\":"+str(ods.get(key))+"}"
                flag = 2
            else:
                stringnumber += ",{\"id\":" + str(key) + ", \"n\":" + str(ods.get(key)) + "}"
        stringnumber += "]"

        #stringcluster = '['
        #flag = 1
        #for i in range(len(clustered)):
        #    for j in range(len(clustered[i])):
        #        if flag==1:
        #            stringcluster += '{\"id\":'+str(clustered[i][j])+", \"c\":"+str(i)+'}'
        #            flag = 2
        #        else:
        #            stringcluster += ',{\"id\":'+str(clustered[i][j])+", \"c\":"+str(i)+'}'
        #stringcluster += ']'

        #result = {'sum': sumtrips, 'number': stringnumber, 'cluster': stringcluster}
        result = {'sum': sumtrips, 'number': stringnumber, 'max':max}
        #print(result);
        self.set_header('Access-Control-Allow-Origin', '*');
        self.write(result);

    def get_trips(self, uidsinput, time1, time2, mode):

        mongo_url = "192.168.153.139:27017"
        client = pymongo.MongoClient(mongo_url);
        db = client['wechat']
        collection = db["od"]

        ods = {}
        for j in range(len(uidsinput)):
            cursor = collection.find({"uid": uidsinput[j]})

            for item in cursor:
                t = item['endminute']
                bid = item['ebid']
                number = item['multiple']

                if (t >= time1) and (t <= time2):
                    if (bid in ods):
                        temp = ods.get(bid)
                        ods[bid] = temp + number
                    else:
                        ods[bid] = number

        max = 0;
        for key in ods.keys():
            temp = ods.get(key)
            ods[key] = round(temp)
            if round(temp)> max :
                max = round(temp)

        sumod = 0
        for value in ods.values():
            sumod = sumod + value

        return ods, round(sumod), max

    def clusterDBSCAN(self, counts, avg):
        clusters = []
        visited = []  # item.bid
        clustered = []
        noise = []

        for key in counts:
            neighbors = []
            if key in visited:
                continue
            visited.append(key)
            if len(getNeighbor(key, counts, avg)) != 0:
                neighbors += getNeighbor(key, counts, avg)
                # print('n1', neighbors)

            if len(neighbors) <= 2:  # minimum number of  TAZs to into a cluster
                noise.append(key)
            else:
                clustered.append(key)

                newcluster = []  # where?
                newcluster.append(key)

                for i in range(len(neighbors)):
                    if not (neighbors[i] in visited):
                        visited.append(neighbors[i])
                        neighbornew = []
                        neighbornew = getNeighbor(neighbors[i], counts, avg)
                        if len(neighbornew) >= 3:
                            neighbors = neighbors + neighbornew
                            # for k in neighbornew:
                            #    if not (k in neighbors):
                            #        neighbors = neighbors.append(k)
                    if not neighbors[i] in clustered:
                        newcluster.append(neighbors[i])
                        clustered.append(neighbors[i])
                clusters.append(newcluster)
        print('in', type(clusters), len(clusters))
        return clusters


def getNeighbor(bid, counts, avg):
    neighbors = []
    beta = 0.3 * avg  # 0.3 here 30%, parameter
    adj = []

    mongo_url = "192.168.153.129:27017"
    client = pymongo.MongoClient(mongo_url);
    db = client['wechat']
    collection = db["TAZ_adj"]
    cursor = collection.find({'bid': bid})
    for item in cursor:
        adj = item['adjacent']

    n1 = counts.get(bid)
    for i in range(len(adj)):
        bidd = adj[i]
        if bidd in counts.keys():
            n2 = counts.get(bidd)
            if (n1>1.5*avg) and (n2>1.5*avg):
                neighbors.append(bidd)
            else:
                if (n1 >= 0.9*avg) and (n2 >= 0.9*avg) and (abs(n1 - n2) <= beta):
                    neighbors.append(bidd)
    return neighbors



class PurposeHandler(tornado.web.RequestHandler):
    def post(self):
        va = self.get_argument('value');
        st = int(self.get_argument('st'));
        et = int(self.get_argument('et'));
        p = int(self.get_argument('p'));
        userId = va.split(',')

        ods = {}
        sumtrips = 0
        ods, sumtrips, max = self.getOne(userId, st, et, p)

        stringnumber = '['
        flag = 1
        for key in ods.keys():
            if flag==1:
                stringnumber += "{\"id\":"+str(key)+", \"n\":"+str(ods.get(key))+"}"
                flag = 2
            else:
                stringnumber += ",{\"id\":" + str(key) + ", \"n\":" + str(ods.get(key)) + "}"
        stringnumber += "]"

        result = {'sum': sumtrips, 'number': stringnumber, 'max' : max}
        self.set_header('Access-Control-Allow-Origin', '*');
        self.write(result);

    def getOne(self, uidsinput, time1, time2, p):

        mongo_url = "192.168.153.139:27017"
        client = pymongo.MongoClient(mongo_url);
        db = client['wechat']

        collection = db["od"]
        ods = {}
        for j in range(len(uidsinput)):
            cursor = collection.find({"uid": uidsinput[j], "purpose": p})

            for item in cursor:
                t = item['endminute']
                bid = item['ebid']
                number = item['multiple']

                if (t >= time1) and (t <= time2):
                    if (bid in ods):
                        temp = ods.get(bid)
                        ods[bid] = temp + number
                    else:
                        ods[bid] = number

        max = 0;
        for key in ods.keys():
            temp = ods.get(key)
            ods[key] = round(temp)
            if round(temp)> max :
                max = round(temp)

        sumod = 0
        for value in ods.values():
            sumod = sumod + value

        return ods, round(sumod), max

class PClusterHandler(tornado.web.RequestHandler):
        def post(self):
            va = self.get_argument('value');
            st = int(self.get_argument('st'));
            et = int(self.get_argument('et'));
            userId = va.split(',')

            types = {}
            ps = {}
            ns = {}
            types, ps, ns = self.getType(userId, st, et)

            stringnumber = '['
            flag = 1
            for key in types.keys():
                if flag == 1:
                    stringnumber += "{\"id\":" + str(key) + ", \"t\":" + str(types.get(key)) + ", \"p\":" + str(ps.get(key))+", \"n\":" + str(ns.get(key))+"}"
                    flag = 2
                else:
                    stringnumber += ",{\"id\":" + str(key) + ", \"t\":" + str(types.get(key)) + ", \"p\":" + str(ps.get(key))+", \"n\":" + str(ns.get(key))+"}"
            stringnumber += "]"

            result = {'number': stringnumber}
            self.set_header('Access-Control-Allow-Origin', '*');
            self.write(result);

        def getType(self, uidsinput, time1, time2):

            mongo_url = "192.168.153.139:27017"
            client = pymongo.MongoClient(mongo_url);
            db = client['wechat']

            collection = db["od"]
            ods = {}

            for j in range(len(uidsinput)):
                cursor = collection.find({"uid": uidsinput[j]})

                for item in cursor:
                    t = item['endminute']
                    bid = item['ebid']
                    p = item['purpose']
                    n = item['multiple']

                    if (t >= time1) and (t <= time2):
                        if (bid in ods):
                            temp = ods.get(bid)
                            temp.append(p)
                            ods[bid] = temp
                        else:
                            temp = [];
                            temp.append(p);
                            ods[bid] = temp;

            bidtype = {}
            bidpercent = {}
            bidnumber = {}
            for key in ods.keys():
                pp = {}
                temp = ods.get(key)
                for i in range(len(temp)):
                       if (temp[i] in pp):
                           num = pp.get(temp[i])
                           pp[temp[i]] = num + 1
                       else:
                           pp[temp[i]] = 1

                max = 0;
                sum = 0;
                maxtype = 0;
                for key2 in pp.keys():
                    sum+=pp.get(key2)
                    if(pp.get(key2)>max):
                        max = pp.get(key2)
                        maxtype = key2

                bidtype[key] = maxtype
                bidpercent[key] = max*100//sum
                bidnumber[key] = sum

            return bidtype, bidpercent, bidnumber
