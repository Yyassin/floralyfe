const config = {
    GRAPHQL_URL: "https://floralyfeg.loca.lt",
    WS_URL: "wss://floralyfec.loca.lt",
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