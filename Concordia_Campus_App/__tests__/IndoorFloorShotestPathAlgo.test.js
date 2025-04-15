import { findShortestPath } from "../maps/IndoorFloorShortestPathAlgo";

const mockFloorData = {
    "elevator": { "connected_nodes": ["node_1"] },
    "node_1": { "connected_nodes": ["node_2", "elevator"] },
    "node_2": { "connected_nodes": ["node_3", "node_1"] },
    "node_3": { "connected_nodes": ["node_4", "node_2"] },
    "node_4": { "connected_nodes": ["831", "node_3"] },
    "831": { "connected_nodes": [] },
};

describe('findShortestPath', () => {
    test('finds the shortest path between two nodes', () => {
        const path = findShortestPath("node_1", "node_4", mockFloorData);
        expect(path).toEqual(["node_1", "node_2", "node_3", "node_4"]);
    });

    test('returns the orrect path for direct connection', () => {
        const path = findShortestPath("node_2", "node_3", mockFloorData);
        expect(path).toEqual(["node_2", "node_3"]);
    });

    test('returns the correct path when start and end are the same', () => {
        const path = findShortestPath("elevator", "elevator", mockFloorData);
        expect(path).toEqual(["elevator", "elevator"]);
    });

    test('returns null when no path exists', () => {
        const path = findShortestPath("node_1", "Z", mockFloorData);
        expect(path).toBeNull();
    });

    test('returns null for an empty floor data object', () => {
        const path = findShortestPath("node_1", "node_2", {});
        expect(path).toBeNull();
    });

    test('returns the shortest path when there is more than one path available', () => {
        const mockFloorDataTwoPaths = {
            "node_1": { "connected_nodes": ["node_2", "node_3"] },
            "node_2": { "connected_nodes": ["node_4"] },
            "node_3": { "connected_nodes": ["node_4"] },
            "node_4": { "connected_nodes": [] }
        };
        const path = findShortestPath("node_1", "node_4", mockFloorDataTwoPaths);
        expect(path).toEqual(["node_1", "node_2", "node_4"]);
    });
});
