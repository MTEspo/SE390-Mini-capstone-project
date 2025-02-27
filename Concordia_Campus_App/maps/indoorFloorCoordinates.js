const indoorFloorData = {
"buildings": [
    {
        "name": "Hall Building",
        
        "floor-2":{
            "classCoordinates": {
                "831": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "last_connecting_node":10 },
                "820": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "last_connecting_node":10},
            },
            "node_1":{ "latitude": 45.49724031377742, "longitude": -73.57936484536624, "connected_nodes":[]},
            "node_2":{ "latitude": 45.495359016476655, "longitude": -73.57936484536624, "connected_nodes":[]},
            "path_to_escalator_up":[
                { "latitude": 45.495359016476655, "longitude": -73.57936484536624},
                { "latitude": 45.495359016476655, "longitude": -73.57936484536624 },
                { "latitude": 45.495359016476655, "longitude": -73.57936484536624 }
            ],
            "esclator_up": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "last_connecting_node":10 },
            "esclator_down":{ "latitude": 45.495359016476655, "longitude": -73.57936484536624, "last_connecting_node":10 },
            "elevator": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "last_connecting_node":10 },
            "floorImage": "",
        },
        "floor-8":{
            "classCoordinates": {
                "831": { "latitude": 45.49718353071313, "longitude": -73.57942766173308, "last_connecting_node":["node_9"]},
                "820": { "latitude": 45.49715481967915, "longitude": -73.57899370470575, "last_connecting_node":["node_11","node_13"]},
            },
            "node_1":{ "latitude": 45.49724031377742, "longitude": -73.57885075811465, "connected_nodes":["node_2","node_3"]},
            "node_2":{ "latitude": 45.49720449198724, "longitude": -73.57888448670585, "connected_nodes":["node_1","node_4","node_5"]},
            "node_3":{ "latitude": 45.49731475495636, "longitude":  -73.57878055204614, "connected_nodes":["node_1"]},
            "node_4":{ "latitude": 45.497142326175315, "longitude":  -73.57874341241356, "connected_nodes":["node_2","node_14"]},
            "node_5":{ "latitude": 45.49729464097251, "longitude":  -73.5790534330916, "connected_nodes":["node_2","node_6","node_7"]},
            "node_6":{ "latitude": 45.49733040509946, "longitude":  -73.57902603190709, "connected_nodes":["node_5"]},
            "node_7":{ "latitude": 45.49734563796144, "longitude":  -73.57915295924258, "connected_nodes":["node_5","node_8"]},
            "node_8":{ "latitude": 45.49720740822167, "longitude":  -73.57930441205546, "connected_nodes":["node_7","node_9","node_10"]},
            "node_9":{ "latitude": 45.49734563796144, "longitude":  -73.57915295924258, "connected_nodes":["node_8"]},
            "node_10":{ "latitude": 45.49709715658615, "longitude":  -73.57909762017272, "connected_nodes":["node_8","node_11","node_12"]},
            "node_11":{ "latitude": 45.497125710848046, "longitude":  -73.5790843684466, "connected_nodes":["node_10"]},
            "node_12":{ "latitude": 45.49706000164386, "longitude":  -73.57901663740206, "connected_nodes":["node_10","node_13","node_14"]},
            "node_13":{ "latitude": 45.49708477161859, "longitude":  -73.57899651440307, "connected_nodes":["node_12"]},
            "node_14":{ "latitude": 45.49699463636985, "longitude":  -73.57888608335224, "connected_nodes":["node_12","node_4"]},
            "esclator_up": { "latitude": 45.4972717500672, "longitude": -73.5789019818176, "last_connecting_node": 10 },
            "esclator_down":{ "latitude": 45.497302657035235, "longitude": -73.57896357181264, "last_connecting_node": 10 },
            "elevator": { "latitude": 45.49729026677937, "longitude": -73.57875190045378, "last_connecting_node": 10 },
            "floorImage": "",
        },
    },
]
}

export default indoorFloorData;