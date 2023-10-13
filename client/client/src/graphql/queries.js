import { gql } from '@apollo/client';


export const GET_ALL_USERS = gql`
    query Users {
        users {
        email
        firstName
        id
        lastName
        }
    }
`;


export const GET_MESSAGES= gql`
    query MessagesByUser($receivedId: Int!) {
        messagesByUser(receivedId: $receivedId) {
            id
            text
            receivedId
            senderId
            createdAt
        }
    }
`;