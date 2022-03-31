const config = {
    GRAPHQL_URL: "https://floralyfeg.loca.lt",
    WS_URL: "ws://localhost:5000/",
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