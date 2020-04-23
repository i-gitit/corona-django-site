from django.shortcuts import render
from bs4 import BeautifulSoup
import requests
import json
import time


###########variables################
curtime=time.time()
peri=[""]*2
perw=[""]*2
maxcase=[]
maxdeath=[]
maxdcase=[]
maxddeath=[]
# def getworld():
#   webdata=requests.get("https://www.worldometers.info/coronavirus/")
#   htmldata=webdata.text
#   soup=BeautifulSoup(htmldata,"html.parser")
#   a = soup.find_all("div", attrs={'class':'maincounter-number'})
#   world=[]
#   for b in a:
#     world.append(int(b.text.replace("\n","").replace(",","")))
#   world.append(world[1]*100/world[0])
#   world.append(world[2]*100/world[0])
#   return world

def getworld():
    global maxcase
    global maxdeath
    global maxdcase
    global maxddeath
    webdata=requests.get("https://www.worldometers.info/coronavirus/")
    htmldata=webdata.text
    soup=BeautifulSoup(htmldata,"html.parser")
    world=[]
    a = soup.find("table", attrs={'id':'main_table_countries_today'})
    for row in a.find_all('tr')[8:-9]:
        country=[]
        for r in row.find_all('td')[:8]:
            country.append(r.text)
        world.append(country)
    i=1
    max=0
    deathi=0
    for c in world[1:15]:
        if int(c[3].replace(',',''))>max:
            max=int(c[3].replace(',',''))
            deathi = i
        i+=1
    i=1
    deltacase=0
    max=0
    for c in world[1:-80]:
        if c[2] and int(c[2].replace(',',''))>max:
            max=int(c[2].replace(',',''))
            deltacase = i
        i+=1
    i=1
    deltadeath=0
    max=0
    for c in world[1:-80]:
        if c[4] and int(c[4].replace(',',''))>max:
            max=int(c[4].replace(',',''))
            deltadeath = i
        i+=1
    perw[0]=int(world[0][3].replace(',',''))*100/int(world[0][1].replace(',',''))
    perw[1]=int(world[0][5].replace(',',''))*100/int(world[0][1].replace(',',''))
    maxdeath=world[deathi]
    maxdcase=world[deltacase]
    maxddeath=world[deltadeath]
    return world



def getindia():
    statetotal=requests.get("https://api.covid19india.org/data.json").json()['statewise']
    peri[0]=int(statetotal[0]['deaths'])*100/int(statetotal[0]['confirmed'])
    peri[1]=int(statetotal[0]['recovered'])*100/int(statetotal[0]['confirmed'])
    return(statetotal[0])

def getStates():
    statewised={}
    statetotal=requests.get("https://api.covid19india.org/data.json").json()['statewise']
    statewise=requests.get("https://api.covid19india.org/state_district_wise.json").json()
    for a in statetotal[1:]:
        if(statewise.get(a['state'])):
            statewised[a['state']]=a
            tosort=statewise[a['state']]['districtData']
            sortd=sorted(tosort.items(), key=lambda x: x[1]['confirmed'],reverse=True)
            statewised[a['state']]['districtData']=dict(sortd)
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
world=getworld()
def index(request):
    global world
    global curtime
    a=time.time()
    if(a-curtime>=600):
        world=getworld()
        curtime=a
        print("Called")
    else:
        print("Not called")
    return render(request,'index.html',
                        {"world_data":world,
                        "india_data":getindia(),
                        "per":peri,
                        "perw":perw,
                        "maxd":maxdeath,
                        "maxdc":maxdcase,
                        "maxdd":maxddeath})
    #return render(request,'base.html')

def india(request):
    return render(request,'india.html',{"sw":getStates()})


def countries(request):
    global world
    global curtime
    a=time.time()
    if(a-curtime>=600):
        world=getworld()
        curtime=a
        print("Called")
    else:
        print("Not called")
    return render(request,'countries.html',
                        {"world_data":world[1:]})

def aboutvirus(request):
    return render(request,'aboutvirus.html')

def comingsoon(request):
    return render(request,'comingsoon.html')
