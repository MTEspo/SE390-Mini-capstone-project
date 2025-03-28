const indoorFloorData = {
"buildings": [
    {
        "name": "Henry F.Hall Building",
        "floor-1":{
                "H-110": { "latitude": 45.497108735151485, "longitude": -73.57893689860926, "last_connecting_node":["node_4"]},
                "node_1":{ "latitude": 45.49704709346159, "longitude": -73.57870881910416, "connected_nodes":["node_3","node_5"]},
                "node_3":{ "latitude": 45.497083347532964, "longitude":  -73.57874286468316, "connected_nodes":["node_1","node_4","node_5"]},
                "node_4":{ "latitude":45.49709762269207, "longitude":  -73.57878851166575, "connected_nodes":["node_3","node_5","node_8"]},
                "node_5":{ "latitude": 45.49713273628391, "longitude":  -73.57869698361705, "connected_nodes":["node_3","node_4","node_8","node_6"]},
                "node_6":{ "latitude": 45.49717408497438, "longitude":  -73.57864782532806, "connected_nodes":["node_5","node_7","node_8"]},
                "node_7":{ "latitude": 45.49719621004974, "longitude":  -73.57861435087062, "connected_nodes":["node_6"]},
                "node_8":{ "latitude": 45.49721182383456, "longitude":  -73.57871196519791, "connected_nodes":["node_9","node_6","node_5","node_4"]},
                "node_9":{ "latitude": 45.49723479529576, "longitude":  -73.57876557113804, "connected_nodes":["node_8","node_10"]},
                "node_10":{ "latitude": 45.49729731046027, "longitude":  -73.57870915615288, "connected_nodes":["node_9"]},
                "escalator_up": { "latitude": 45.49728029519156, "longitude": -73.57856168535761, "last_connecting_node": ["node_7"] },
                "escalator_down":{ "latitude": 45.497212132955724, "longitude": -73.57864730686212, "last_connecting_node":[ "node_7"] },
                "elevator": { "latitude": 45.49727891671142, "longitude": -73.5786661115211, "last_connecting_node": ["node_10"] },
                "building_entrance": { "latitude": 45.49703513985683, "longitude": -73.57867423689423, "last_connecting_node": ["node_1"] },
                "exit":{ "latitude": 45.497212132955724, "longitude": -73.57864730686212, "last_connecting_node":[ "node_7"] },
                "imageFloorPath": require('../assets/floor_plans/Hall-1.png')
        },
        "floor-2":{
                "node_1":{ "latitude": 45.497289106308045, "longitude":-73.57875773778838, "connected_nodes":["node_2","node_4"]},
                "node_2":{ "latitude": 45.49733135820939, "longitude":-73.57885815532305, "connected_nodes":["node_1","node_3"]},
                "node_3":{ "latitude": 45.497311379081786, "longitude":  -73.57893464394255, "connected_nodes":["node_2"]},
                "node_4":{ "latitude":45.49721695047203, "longitude":  -73.57878353632223, "connected_nodes":["node_1"]},
                "escalator_up": { "latitude": 45.497291680773145, "longitude": -73.5789156351803, "last_connecting_node": ["node_3"] },
                "escalator_down":{ "latitude": 45.49721831262093, "longitude": -73.57880257754711, "last_connecting_node":[ "node_4"] },
                "elevator": { "latitude": 45.497291520968666, "longitude": -73.57868839449006, "last_connecting_node": ["node_1"] },
                "entrance":{ "latitude": 45.49733234330694, "longitude": -73.57866423077638, "last_connecting_node": ["node_1"] },
                "exit":{ "latitude": 45.49725785948051, "longitude": -73.57872848452577, "last_connecting_node": ["node_1","node_4"] },
                "imageFloorPath": require('../assets/floor_plans/Hall-2.png')
        },
        "floor-8":{
            "H-831": { "latitude": 45.49718353071313, "longitude": -73.57942766173308, "last_connecting_node":["node_9"]},
            "H-820": { "latitude": 45.49715481967915, "longitude": -73.57899370470575, "last_connecting_node":["node_11","node_13"]},
            "node_1":{ "latitude": 45.49724031377742, "longitude": -73.57885075811465, "connected_nodes":["node_2","node_3"]},
            "node_2":{ "latitude": 45.49720449198724, "longitude": -73.57888448670585, "connected_nodes":["node_1","node_4","node_5"]},
            "node_3":{ "latitude": 45.49731475495636, "longitude":  -73.57878055204614, "connected_nodes":["node_1"]},
            "node_4":{ "latitude": 45.497142326175315, "longitude":  -73.57874341241356, "connected_nodes":["node_2","node_14"]},
            "node_5":{ "latitude": 45.49729464097251, "longitude":  -73.5790534330916, "connected_nodes":["node_2","node_6","node_7"]},
            "node_6":{ "latitude": 45.49733040509946, "longitude":  -73.57902603190709, "connected_nodes":["node_5"]},
            "node_7":{ "latitude": 45.4973426750073, "longitude":  -73.57916528995467, "connected_nodes":["node_5","node_8"]},
            "node_8":{ "latitude": 45.49720740822167, "longitude":  -73.57930441205546, "connected_nodes":["node_7","node_9","node_10"]},
            "node_9":{ "latitude": 45.49718465692337, "longitude":  -73.5793455476141, "connected_nodes":["node_8"]},
            "node_10":{ "latitude": 45.49709715658615, "longitude":  -73.57909762017272, "connected_nodes":["node_8","node_11","node_12"]},
            "node_11":{ "latitude": 45.497125710848046, "longitude":  -73.5790843684466, "connected_nodes":["node_10"]},
            "node_12":{ "latitude": 45.49706000164386, "longitude":  -73.57901663740206, "connected_nodes":["node_10","node_13","node_14"]},
            "node_13":{ "latitude": 45.49708477161859, "longitude":  -73.57899651440307, "connected_nodes":["node_12"]},
            "node_14":{ "latitude": 45.49699463636985, "longitude":  -73.57888608335224, "connected_nodes":["node_12","node_4"]},
            "escalator_up": { "latitude": 45.4972717500672, "longitude": -73.5789019818176, "last_connecting_node": ["node_1"] },
            "escalator_down":{ "latitude": 45.497302657035235, "longitude": -73.57896357181264, "last_connecting_node":[ "node_6"] },
            "elevator": { "latitude": 45.49729026677937, "longitude": -73.57875190045378, "last_connecting_node": ["node_3"] },
            "entrance": { "latitude": 45.4972717500672, "longitude": -73.5789019818176, "last_connecting_node": ["node_1"] }, // same as escalator up
            "exit":{ "latitude": 45.497302657035235, "longitude": -73.57896357181264, "last_connecting_node":[ "node_6"] },// same as escalator down
            "imageFloorPath": require('../assets/floor_plans/Hall-8.png')
        },
        "floor-9":{
            "H-937": { "latitude": 45.49734371711722 , "longitude":-73.57916179626424 , "last_connecting_node":["node_13"]},
            "H-963": { "latitude": 45.497459190173984, "longitude":-73.57868994786249 , "last_connecting_node":["node_6"]},
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
            "escalator_up": { "latitude": 45.497312211471396, "longitude": -73.57897960517127, "last_connecting_node": ["node_9"] },
            "escalator_down":{ "latitude": 45.497265437958, "longitude": -73.57887387390885, "last_connecting_node":[ "node_1","node_8"] },
            "elevator": { "latitude": 45.49729026677937, "longitude": -73.57875190045378, "last_connecting_node": ["node_4"] },
            "entrance": { "latitude": 45.497312211471396, "longitude": -73.57897960517127, "last_connecting_node": ["node_9"] },// same as escalator up
            "exit":{ "latitude": 45.497265437958, "longitude": -73.57887387390885, "last_connecting_node":[ "node_1","node_8"] },// same as escalator down
            "imageFloorPath": require('../assets/floor_plans/Hall-9.png')
        },
    },
    {
        "name": "John Molson School of Business",
        "floor-1":{
                "MB-1.210": { "latitude": 45.495255445952, "longitude": -73.57889029229129, "last_connecting_node":["node_6"]},
                "MB-1.301": { "latitude": 45.49526392732338, "longitude": -73.57916898427824, "last_connecting_node":["node_9"]},
                "node_1":{ "latitude": 45.495458095730825, "longitude": -73.57924119031567, "connected_nodes":["node_2"]},
                "node_2":{ "latitude":45.495427399896336 , "longitude":-73.5791545664648, "connected_nodes":["node_1","node_3","node_4"]},
                "node_3":{ "latitude": 45.49545767483711, "longitude":  -73.57912561167194, "connected_nodes":["node_2"]},
                "node_4":{ "latitude":45.49535257671732, "longitude":  -73.57903205196267, "connected_nodes":["node_2","node_5"]},
                "node_5":{ "latitude": 45.49532031638483, "longitude":  -73.57898589967473, "connected_nodes":["node_4","node_6","node_7"]},
                "node_6":{ "latitude": 45.49529072564589, "longitude":  -73.5789363344617, "connected_nodes":["node_5"]},
                "node_7":{ "latitude": 45.495272417492586, "longitude":  -73.57903000277251, "connected_nodes":["node_5","node_8"]},
                "node_8":{ "latitude": 45.495235480958655, "longitude": -73.57905274028364, "connected_nodes":["node_7","node_9"]},
                "node_9":{ "latitude": 45.49525234377117, "longitude": -73.57909000002424, "connected_nodes":["node_8"]},
                "escalator_up": { "latitude": 45.495420803406866, "longitude": -73.57905559002522, "last_connecting_node": ["node_3"] },
                "escalator_down":{ "latitude": 45.495420803406866, "longitude": -73.57905559002522, "last_connecting_node":[ "node_3"] },
                "elevator": { "latitude": 45.49529020572514, "longitude": -73.57906292356449, "last_connecting_node": ["node_7"] },
                "building_entrance":{ "latitude": 45.49549607659399, "longitude": -73.57921570098344, "last_connecting_node": ["node_1"] },
                "exit":{ "latitude": 45.495420803406866, "longitude": -73.57905559002522, "last_connecting_node": ["node_3"] },
                "imageFloorPath": require('../assets/floor_plans/MB-1.png')
        },
        
    },
    {
        "name": "Vanier Library Building",
        "floor-1":{
            "VL-122": { "latitude": 45.45897317757964, "longitude": -73.6384588390033, "last_connecting_node":["node_3"]},
            "node_1":{ "latitude": 45.459064364787544, "longitude": -73.63858107542114, "connected_nodes":["node_2","node_3"]},
            "node_2":{ "latitude":45.4590268776782 , "longitude":-73.6384611143011, "connected_nodes":["node_1","node_3","node_4"]},
            "node_3":{ "latitude": 45.45898332647579, "longitude":  -73.63848796053296, "connected_nodes":["node_2","node_1"]},
            "node_4":{ "latitude": 45.45895533374485, "longitude":  -73.63824950515938, "connected_nodes":["node_2","node_5"]},
            "node_5":{ "latitude": 45.45893098200943, "longitude":  -73.63820173912639, "connected_nodes":["node_4"]},
            "escalator_up": { "latitude": 45.458914311689526, "longitude": -73.63821898150404, "last_connecting_node": ["node_5"] },
            "escalator_down":{ "latitude": 45.458914311689526, "longitude": -73.63821898150404, "last_connecting_node":[ "node_5"] },
            "elevator": { "latitude": 45.45895337253184, "longitude": -73.63819335094439, "last_connecting_node": ["node_5"] },
            "node_6": { "latitude": 45.45912541331684, "longitude": -73.63862920372623, "last_connecting_node": ["node_1"] },
            "exit":{ "latitude": 45.458914311689526, "longitude": -73.63821898150404, "last_connecting_node": ["node_5"] }, //same as escalators
            "node_7": { "latitude": 45.45917539034466, "longitude": -73.63879626683736, "last_connecting_node": ["node_6"] },
            "building_entrance": { "latitude": 45.459074227779034, "longitude": -73.63891446924218, "last_connecting_node": ["node_7"] },
            "imageFloorPath": require('../assets/floor_plans/VL-1.png')
    },
        "floor-2":{
                "VL-203": { "latitude": 45.45904676633085, "longitude": -73.63860904734719, "last_connecting_node":["node_3"]},
                "node_1":{ "latitude": 45.45893064485964, "longitude": -73.63820745053077, "connected_nodes":["node_2"]},
                "node_2":{ "latitude":45.45897101316622 , "longitude":-73.63829436140915, "connected_nodes":["node_1","node_3",]},
                "node_3":{ "latitude": 45.45903655451709, "longitude":  -73.63856587933401, "connected_nodes":["node_2"]},
                "escalator_up": { "latitude": 45.458911524898866, "longitude": -73.63822343560838, "last_connecting_node": ["node_1"] },
                "escalator_down":{ "latitude": 45.458911524898866, "longitude": -73.63822343560838, "last_connecting_node":[ "node_1"] },
                "elevator": { "latitude": 45.45895042230208, "longitude": -73.63818825183922, "last_connecting_node": ["node_1"] },
                "entrance": { "latitude": 45.458911524898866, "longitude": -73.63822343560838, "last_connecting_node": ["node_1"] },// same as escalator up & down
                "exit":{ "latitude": 45.458911524898866, "longitude": -73.63822343560838, "last_connecting_node": ["node_1"] },// same as escalator up & down
                "imageFloorPath": require('../assets/floor_plans/VL-2.png')
        },
        
    },
]
}

export default indoorFloorData;