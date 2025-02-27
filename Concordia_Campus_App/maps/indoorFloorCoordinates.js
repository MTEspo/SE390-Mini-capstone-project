const indoorFloorData = {
"buildings": [
    {
        "name": "Hall Building",
        
        "floor-2":{
            "classCoordinates": {
                "831": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "connected_nodes":[] },
                "820": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "connected_nodes":[]},
            },
            "node_1":{ "latitude": 45.49724031377742, "longitude": -73.57936484536624, "connected_nodes":[]},
            "node_2":{ "latitude": 45.495359016476655, "longitude": -73.57936484536624, "connected_nodes":[]},
            "path_to_escalator_up":[
                { "latitude": 45.495359016476655, "longitude": -73.57936484536624},
                { "latitude": 45.495359016476655, "longitude": -73.57936484536624 },
                { "latitude": 45.495359016476655, "longitude": -73.57936484536624 }
            ],
            "esclator_up": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "connected_nodes":[] },
            "esclator_down":{ "latitude": 45.495359016476655, "longitude": -73.57936484536624, "connected_nodes":[] },
            "elevator": { "latitude": 45.495359016476655, "longitude": -73.57936484536624, "connected_nodes":[] },
            "floorImage": "",
        },
        "floor-8":{
            "831": { "latitude": 45.49718353071313, "longitude": -73.57942766173308, "last_connecting_node":["node_9"]},
            "820": { "latitude": 45.49715481967915, "longitude": -73.57899370470575, "last_connecting_node":["node_11","node_13"]},
            "node_1":{ "latitude": 45.49724031377742, "longitude": -73.57885075811465, "connected_nodes":["node_2","node_3"]},
            "node_2":{ "latitude": 45.49720449198724, "longitude": -73.57888448670585, "connected_nodes":["node_1","node_4","node_5"]},
            "node_3":{ "latitude": 45.49731475495636, "longitude":  -73.57878055204614, "connected_nodes":["node_1"]},
            "node_4":{ "latitude": 45.497142326175315, "longitude":  -73.57874341241356, "connected_nodes":["node_2","node_14"]},
            "node_5":{ "latitude": 45.49729464097251, "longitude":  -73.5790534330916, "connected_nodes":["node_2","node_6","node_7"]},
            "node_6":{ "latitude": 45.49733040509946, "longitude":  -73.57902603190709, "connected_nodes":["node_5"]},
            "node_7":{ "latitude": 45.49734563796144, "longitude":  -73.57915295924258, "connected_nodes":["node_5","node_8"]},
            "node_8":{ "latitude": 45.49720740822167, "longitude":  -73.57930441205546, "connected_nodes":["node_7","node_9","node_10"]},
            "node_9":{ "latitude": 45.49718465692337, "longitude":  -73.5793455476141, "connected_nodes":["node_8"]},
            "node_10":{ "latitude": 45.49709715658615, "longitude":  -73.57909762017272, "connected_nodes":["node_8","node_11","node_12"]},
            "node_11":{ "latitude": 45.497125710848046, "longitude":  -73.5790843684466, "connected_nodes":["node_10"]},
            "node_12":{ "latitude": 45.49706000164386, "longitude":  -73.57901663740206, "connected_nodes":["node_10","node_13","node_14"]},
            "node_13":{ "latitude": 45.49708477161859, "longitude":  -73.57899651440307, "connected_nodes":["node_12"]},
            "node_14":{ "latitude": 45.49699463636985, "longitude":  -73.57888608335224, "connected_nodes":["node_12","node_4"]},
            "esclator_up": { "latitude": 45.4972717500672, "longitude": -73.5789019818176, "last_connecting_node": ["node_1"] },
            "esclator_down":{ "latitude": 45.497302657035235, "longitude": -73.57896357181264, "last_connecting_node":[ "node_6"] },
            "elevator": { "latitude": 45.49729026677937, "longitude": -73.57875190045378, "last_connecting_node": ["node_3"] },
            "floorImage": "",
        },
        "floor-9":{
            "937": { "latitude": 45.49734371711722 , "longitude":-73.57916179626424 , "last_connecting_node":["node_13"]},
            "963": { "latitude": 45.497459190173984, "longitude":-73.57868994786249 , "last_connecting_node":["node_6"]},
            "node_1":{ "latitude": 45.49725438280765, "longitude": -73.57884397140393, "connected_nodes":["node_2","node_8","node_4"]},
            "node_2":{ "latitude":45.497230495167464 , "longitude":-73.57886963727913, "connected_nodes":["node_1","node_8","node_3"]},
            "node_3":{ "latitude":45.49716596171168 , "longitude": -73.57874375666093 , "connected_nodes":["node_2","node_7"]},
            "node_4":{ "latitude":45.49731198149953 , "longitude": -73.57878786775773 , "connected_nodes":["node_1","node_5"]},
            "node_5":{ "latitude":45.49739955206823 , "longitude":  -73.57870924072002, "connected_nodes":["node_4","node_6","node_7"]},
            "node_6":{ "latitude": 45.49741258400346, "longitude": -73.57872105842756 , "connected_nodes":["node_5"]},
            "node_7":{ "latitude":45.49734334163928 , "longitude": -73.5785803720853 , "connected_nodes":["node_5","node_3"]},
            "node_8":{ "latitude": 45.49724945181983, "longitude":  -73.57890505941543, "connected_nodes":["node_9","node_2","node_1"]},
            "node_9":{ "latitude": 45.49729145675457, "longitude": -73.57899471475994 , "connected_nodes":["node_8","node_10"]},
            "node_10":{ "latitude":45.49731114655464 , "longitude":  -73.57904059583481, "connected_nodes":["node_9","node_11"]},
            "node_11":{ "latitude": 45.49724075548781, "longitude": -73.5791045015969 , "connected_nodes":["node_10","node_12"]},
            "node_12":{ "latitude": 45.49727816614321, "longitude": -73.57918830476792 , "connected_nodes":["node_11","node_13"]},
            "node_13":{ "latitude": 45.49729244125229, "longitude": -73.57916840736969 , "connected_nodes":["node_12"]},
            "esclator_up": { "latitude": 45.497312211471396, "longitude": -73.57897960517127, "last_connecting_node": ["node_9"] },
            "esclator_down":{ "latitude": 45.497302657035235, "longitude": -73.57896357181264, "last_connecting_node":[ "node_1","node_8"] },
            "elevator": { "latitude": 45.49729026677937, "longitude": -73.57875190045378, "last_connecting_node": ["node_4"] },
            "floorImage": "",
        },
    },
]
}

export default indoorFloorData;