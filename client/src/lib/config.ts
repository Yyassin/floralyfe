/**
 * config.ts
 * 
 * System variables.
 */

// Server endpoints and default ids.
const config = {
    GRAPHQL_URL: "http://5999-174-112-246-246.ngrok.io",
    WS_URL: "ws://65e9-174-112-246-246.ngrok.io",
    USER_ID: "yousef",
    DEVICE_ID: "yousef-device"
}

// WebSocket topics.
enum topics {
    SUBSCRIBE = "subscribe",
    UNSUBSCRIBE = "unsubscribe",
    CAMERA = "camera-topic",
    VITAL = "vitals-topic",
    IRRIGATION = "irrigation-topic"
}

export { config, topics };