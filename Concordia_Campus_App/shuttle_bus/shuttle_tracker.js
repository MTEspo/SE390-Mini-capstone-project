import AsyncStorage from '@react-native-async-storage/async-storage';

let sessionId = null;
let cookieString = null;

export const fetchConcordiaBusData = async () => {
    try {
        if (!cookieString) {
            const storedCookie = await AsyncStorage.getItem('concordiaCookie');
            if (storedCookie) {
                cookieString = storedCookie;
                sessionId = cookieString.split(';')[0].split('=')[1];
                console.log("Cookie loaded from storage:", cookieString);
            } else {
                const getResponse = await fetch(
                    "https://shuttle.concordia.ca/concordiabusmap/Map.aspx",
                    { method: "GET" }
                );

                if (!getResponse.ok) {
                    throw new Error(`GET request failed: ${getResponse.status}`);
                }

                cookieString = getResponse.headers.get('set-cookie');

                if (!cookieString) {
                    throw new Error("No cookie received from GET request");
                }

                await AsyncStorage.setItem('concordiaCookie', cookieString);
                sessionId = cookieString.split(';')[0].split('=')[1];

                console.log("Cookie received and stored:", cookieString);
            }
        }

        console.log("Using sessionId:", sessionId);

        const postResponse = await fetch(
            "https://shuttle.concordia.ca/concordiabusmap/WebService/GService.asmx/GetGoogleObject",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Cookie": cookieString,
                },
            }
        );

        if (!postResponse.ok) {
            const errorText = await postResponse.text();
            throw new Error(`POST request failed: ${postResponse.status} - ${errorText}`);
        }

        const data = await postResponse.json();
        return data;
    } catch (error) {
        console.error("Error fetching Concordia bus data:", error);
        return null;
    }
};