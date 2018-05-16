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


class DataHandler(tornado.web.RequestHandler):
    def post(self):
        va = self.get_argument('value');
        st = int(self.get_argument('st'));
        et = int(self.get_argument('et'));
        m = int(self.get_argument('m'));
        userId = va.split(',')

        ods = {}
        sumtrips = 0
        ods, sumtrips = self.get_trips(userId, st, et, m)
        ods2 = dict(sorted(ods.items(), key=lambda e: e[1], reverse=True))
        avg = sumtrips // len(ods)
        print("avg", avg)

        clustered = self.clusterDBSCAN(ods2, avg)
        print('clusters', len(clustered))

        stringnumber = '['
        flag = 1
        for key in ods2.keys():
            if flag==1:
                stringnumber += "{\"id\":"+str(key)+", \"n\":"+str(ods2.get(key))+"}"
                flag = 2
            else:
                stringnumber += ",{\"id\":" + str(key) + ", \"n\":" + str(ods2.get(key)) + "}"
        stringnumber += "]"

        stringcluster = '['
        flag = 1
        for i in range(len(clustered)):
            for j in range(len(clustered[i])):
                if flag==1:
                    stringcluster += '{\"id\":'+str(clustered[i][j])+", \"c\":"+str(i)+'}'
                    flag = 2
                else:
                    stringcluster += ',{\"id\":'+str(clustered[i][j])+", \"c\":"+str(i)+'}'
        stringcluster += ']'

        result = {'sum': sumtrips, 'number': stringnumber, 'cluster': stringcluster}
        #print(result);
        self.set_header('Access-Control-Allow-Origin', '*');
        self.write(result);

    def get_trips(self, uidsinput, time1, time2, mode):

        mongo_url = "192.168.153.129:27017"
        client = pymongo.MongoClient(mongo_url);
        db = client['wechat']

        if mode == 1:
            timeString = 'startminute'
            bidString = 'sbid'
        else:
            timeString = 'endminute'
            bidString = 'ebid'

        collection = db["od"]
        ods = {}
        for j in range(len(uidsinput)):
            cursor = collection.find({"uid": uidsinput[j]})

            for item in cursor:
                t = item[timeString]
                bid = item[bidString]
                number = item['multiple']

                if (t >= time1) and (t <= time2):
                    if (bid in ods):
                        temp = ods.get(bid)
                        ods[bid] = temp + number
                    else:
                        ods[bid] = number

        for key in ods.keys():
            temp = ods.get(key)
            ods[key] = round(temp)

        sumod = 0
        for value in ods.values():
            sumod = sumod + value

        return ods, round(sumod)

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
