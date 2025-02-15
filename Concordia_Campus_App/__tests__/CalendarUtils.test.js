import { extractTokens, convertDateTime } from "../calendar/calendarUtils";

describe("Calender Utils tests", () => {
    test("gets tokens from url", () => {
        const testURL = "#access_token=access&refresh_token=refresh&provider_token=provider";
        const expectedOutput = {
            access_token: "access",
            refresh_token: "refresh",
            provider_token: "provider"
        }
        expect(extractTokens(testURL)).toStrictEqual(expectedOutput)
    });

    test("gets formated date and time from dateTime", () => {
        const testDateTime = "2025-02-14T05:45:00.00Z"
        expect(convertDateTime(testDateTime)).toBe("2025-02-14, 12:45:00 a.m.");
    });

    test("returns N/A if no dateTime is provided", () => {
        expect(convertDateTime()).toBe("N/A");
    })
});