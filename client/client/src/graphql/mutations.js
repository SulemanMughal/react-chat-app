import { gql } from '@apollo/client';


export const SINGUP_USER = gql`
    mutation SignupUser($userNew: UserInput) {
        signupUser(userNew: $userNew) {
        email
        firstName
        id
        lastName
        }
    }
`


export const LOGIN_USER = gql`
    mutation SignInUser($userSignIn: UserSignInInput) {
        signInUser(userSignIn: $userSignIn) {
        token
        }
  }
`


export const SEND_MESSAGE = gql`
    mutation CreateMessage($receivedId: Int!, $text: String!) {
        createMessage(receivedId: $receivedId, text: $text) {
            id
            text
            receivedId
            senderId
            createdAt
        }
    }
`;