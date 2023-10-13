import React, { useState, useEffect } from 'react'
import { useMatch, useParams } from 'react-router-dom'
import {  AppBar, Toolbar, Typography, Box, IconButton, MenuIcon, Button, Avatar, TextField, Stack } from "@mui/material"
import MessageCard from './MessageCard'

import { MSG_SUB } from "../graphql/subscriptions"

import SendIcon from '@mui/icons-material/Send';


import { useQuery, useMutation } from "@apollo/client"
import { GET_MESSAGES } from '../graphql/queries'
import { SEND_MESSAGE } from '../graphql/mutations';
import { useSubscription } from '@apollo/client';




const ChatScreen = () => {
    const {id, name } = useParams()
    const [text, setText] = useState("")
    const [messages, setMessages] = useState([])
    const { loading:ld, error:err, data } = useQuery(GET_MESSAGES, {
        fetchPolicy: "no-cache" ,
        variables: { receivedId: +id },
        onCompleted(data){
            setMessages(data.messagesByUser)
        }
    });
    const [sendMessage] = useMutation(SEND_MESSAGE, {
        // onCompleted(data){
        //     setMessages((prevMessages) => [...prevMessages, data.createMessage])
        // }
    })

    
    useSubscription(MSG_SUB,{
        onSubscriptionData : ({subscriptionData:data}) => {
            // console.log("Sdfsdfsdfsd")

            console.debug(data)

            setMessages((prevMessages) => ([...prevMessages, data.messageAdded]))
            // setMessages((prevMessages) => [...prevMessages, data.subscriptionData.data.messageAdded])
        }
    })
    // console.debug(data)
    // if(subData) console.log(subData)

    // const [, { data, loading, error }] = useMutation(SINGUP_USER);

    

    if (ld) return 'Loading...';
    if (err) return `Error! ${err.message}`;
   


  return (
    <Box
        flexGrow={1}
    >
        <AppBar 
            position='static'
            sx={{backgroundColor:"#fff", color:"#000" , boxShadow:0}}    

        >
            <Toolbar>
                <Avatar  
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} 
                    sx={{width:"32px", height:"32px" , mr:2}}
                />
                <Typography variant='h6' component='div' sx={{flexGrow:1}}>
                    {name}
                </Typography>
            </Toolbar>
        </AppBar>
        <Box
            backgroundColor="#f5f5f5"
            height={"80vh"}
            padding={"10px"}
            sx={{overflowY:"auto"}}
        >

            {
                ld ? 
                
                <Typography 
                    variant='h6'
                >
                    Loading...
                </Typography>
                : 
                messages.map((message) => (
                    <MessageCard  
                        key={message?.id}
                        text={message?.text} 
                        date={message?.createdAt} 
                        direction={message?.senderId === +id ? "start" : "end"} 
                    />

                ))
            }
            {/* <MessageCard  text={"hi Jhon"} date={"123456"} direction="start" /> */}
        
            
        </Box>
        <Stack
            direction={"row"}
        >
            <TextField
                placeholder='Enter an message'
                variant='standard'
                fullWidth
                multiline
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <SendIcon 
                onClick = {() => {
                    sendMessage({
                        variables : {
                            receivedId : +id,
                            text : text
                        }
                    })
                }}
            />
        </Stack>
    </Box>
  )
}

export default ChatScreen