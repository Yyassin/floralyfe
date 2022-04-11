/**
 * common.ts
 * 
 * Defines common types among all models.
 * @author Yousef 
 */

// Type of ID field.
type ID = string;

// All Firestore Collection names.
enum Collections {
    VITALS = "vitalCollection",
    USERS = "userCollection",
    NOTES = "noteCollection",
    NOTIFICATIONS = "notificationCollection",
    PLANTS = "plantCollection",
}

export { Collections, ID };
