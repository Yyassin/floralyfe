const config = {
    GRAPHQL_URL: "http://7065-174-112-246-246.ngrok.io",
    WS_URL: "ws://990e-174-112-246-246.ngrok.io",
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