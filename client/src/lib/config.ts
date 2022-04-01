const config = {
    GRAPHQL_URL: "http://localhost:5001",
    WS_URL: "ws://8fe4-174-112-246-246.ngrok.io/",
    USER_ID: "yousef",
    DEVICE_ID: "yousef-device"
}

enum topics {
    SUBSCRIBE = "subscribe",
    UNSUBSCRIBE = "unsubscribe",
    CAMERA = "camera-topic",
    VITAL = "vitals-topic",
    IRRIGATION = "irrigation-topic"
}

export { config, topics };