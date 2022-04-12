/**
 * createUSer.ts
 * 
 * The create user query. 
 */

const gql = String.raw;

export const CREATE_USER = gql`
    mutation CreateUser(
        $firstName: String!,
        $lastName: String!,
        $username: String!,
        $email: String!,
        $password: String!
    )
    {
        createUser(
            firstName: $firstName,
            lastName: $lastName,
            username: $username,
            email: $email,
            password: $password,
        ) {
            id
            firstName
            lastName
            username
            email
            password
            deviceID
        }
    }
`