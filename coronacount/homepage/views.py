from django.shortcuts import render
from bs4 import BeautifulSoup
import requests
import json

per=[""]*2
def getworld():
  webdata=requests.get("https://www.worldometers.info/coronavirus/")
  htmldata=webdata.text
  soup=BeautifulSoup(htmldata)
  a = soup.find_all("div", attrs={'class':'maincounter-number'})
  world=[]
  for b in a:
    world.append(int(b.text.replace("\n","").replace(",","")))
  world.append(world[1]*100/world[0])
  world.append(world[2]*100/world[0])
  return world

def getindia():
    statetotal=requests.get("https://api.covid19india.org/data.json").json()['statewise']
    per[0]=int(statetotal[0]['deaths'])*100/int(statetotal[0]['confirmed'])
    per[1]=int(statetotal[0]['recovered'])*100/int(statetotal[0]['confirmed'])
    return(statetotal[0])

def getStates():
    statewised={}
    statetotal=requests.get("https://api.covid19india.org/data.json").json()['statewise']
    statewise=requests.get("https://api.covid19india.org/state_district_wise.json").json()
    for a in statetotal[1:]:
        if(statewise.get(a['state'])):
            statewised[a['state']]=a
            statewised[a['state']]['districtData']=statewise[a['state']]['districtData']
    #statewised=sorted(statewised.items(), key=lambda item: item[1]['confirmed'])
    return(statewised)
# def getStates():
#     statewised={}
#     statetotal=requests.get("https://api.covid19india.org/data.json").json()['statewise']
#     statewise=requests.get("https://api.covid19india.org/state_district_wise.json").json()
#     for a in statetotal[1:]:
#         data=[]
#
#         if(statewise.get(a['state'])):
#             data.append(a['confirmed'])
#             data.append(a['deltaconfirmed'])
#             data.append(a['deaths'])
#             data.append(a['deltadeaths'])
#             data.append(a['recovered'])
#             statewised[a['state']]=data
#     return(statewised)

def index(request):
    return render(request,'index.html',{"world_data":getworld(),"india_data":getindia(),"per":per})

def india(request):
    return render(request,'india.html',{"sw":getStates()})
