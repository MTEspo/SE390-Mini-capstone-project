import indoorFloorData from './indoorFloorCoordinates.js';

export function findShortestPath(start, end, floorData) {
    let graph = {};
    if (start == end){
        return ["elevator", "elevator"];
    }

    for (const [node, data] of Object.entries(floorData)) {
        if (data.connected_nodes) {
            graph[node] = data.connected_nodes;
        }
    }

    // Add class and escalator connections
    for (const [node, data] of Object.entries(floorData.classCoordinates || {})) {
        if (data.last_connecting_node) {
            graph[node] = data.last_connecting_node;
            for (const connectedNode of data.last_connecting_node) {
                if (!graph[connectedNode]) graph[connectedNode] = [];
                graph[connectedNode].push(node);
            }
        }
    }
    
    for (const [node, data] of Object.entries(floorData)) {
        if (data.last_connecting_node) {
            graph[node] = data.last_connecting_node;
            for (const connectedNode of data.last_connecting_node) {
                if (!graph[connectedNode]) graph[connectedNode] = [];
                graph[connectedNode].push(node);
            }
        }
    }

    // Dijkstra's Algorithm
    let distances = {};
    let previous = {};
    let queue = new Set(Object.keys(graph));

    for (let node of queue) {
        distances[node] = Infinity;
    }
    distances[start] = 0;

    while (queue.size > 0) {
        let currentNode = [...queue].reduce((minNode, node) => 
            distances[node] < distances[minNode] ? node : minNode
        );

        queue.delete(currentNode);

        if (currentNode === end) break;

        for (let neighbor of graph[currentNode]) {
            let alt = distances[currentNode] + 1;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = currentNode;
            }
        }
    }

    // Reconstruct path
    let path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }

    return path.length > 1 ? path : null;
}

const floor8 = indoorFloorData.buildings[0]["floor-8"];
const shortestPath = findShortestPath("esclator_up", "831", floor8);
console.log("Shortest Path:", shortestPath);
