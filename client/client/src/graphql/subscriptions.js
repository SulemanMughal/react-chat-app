import { gql } from "@apollo/client";


export const MSG_SUB = gql`
    subscription   onSubscriptionData{
        messageAdded{
            id
            text
            receivedId
            senderId
            createdAt
        }
    }
`;