/**
 * getUser.ts
 * 
 * The get User query. 
 */

export const GET_USER = `
    query getUser($email: String!, $password: String!) {
        users(email: $email, password: $password) {
            id
            firstName
            lastName
            username
            deviceID
            email
            password
        }
    }
`;