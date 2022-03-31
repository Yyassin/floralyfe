/**
 * @jest-environment jsdom
 */
import { renderHook, act } from "@testing-library/react-hooks";
import useWebSocket from "lib/components/hooks/useWebSocket";
import { deepLog } from "lib/components/hooks/validate";

test("useWebSocket::should callback on topic received", async () => {
    const data: any = [];
    const { result } = renderHook(() => useWebSocket());

    const testCallback = (payload: any) => {
        data.push(payload);
    };
    expect(data.length).toBe(0);

    deepLog("subscribing to test-topic");
    act(() => result.current.addSubscription("test-topic", testCallback));

    const expectedPayload = {
        testField: "test",
    };

    const msg = {
        data: {
            topic: "test-topic",
            payload: expectedPayload,
        },
    };
    result.current.onMessage(msg as MessageEvent);

    deepLog("Sending subscribed message");
    deepLog(msg)
    expect(data.length).toBe(1);
    expect(data[0]).toEqual(expectedPayload);
    deepLog("Got callback")
    deepLog(data[0])

    deepLog("Sending non-subscribed message");
    result.current.onMessage({
        data: {
            topic: "non-sub-topic",
            payload: expectedPayload,
        },
    } as MessageEvent);

    expect(data.length).toBe(1);
    expect(data[0]).toEqual(expectedPayload);
    deepLog("Got no callback");
});
