import React from 'react'

import { Box, Typography, Divider, Stack } from "@mui/material"
import UserCard from './UserCard'

import LogoutIcon from "@mui/icons-material/Logout"

import { useQuery } from "@apollo/client"
import { GET_ALL_USERS } from '../graphql/queries'




const SideBar = ({setloggedIn}) => {

    // const users = [
    //     {
    //         id : 1,
    //         firstName : "Jhon",
    //         lastName : "Doe",
    //     },
    //     {
    //         id : 2,
    //         firstName : "Jhon",
    //         lastName : "Doe",
    //     },
    //     {
    //         id : 3,
    //         firstName : "Jhon",
    //         lastName : "Doe",
    //     },
    //     {
    //         id : 4,
    //         firstName : "Jhon",
    //         lastName : "Doe",
    //     },
    // ]


    // const [loading,data,error] =   useQuery(GET_ALL_USERS)


    // if(loading) return (
        
    // )

    // if(data) {
    //     console.debug(data)
    // }

    // if(error){
    //     console.debug(error.message)
    // }
    const { loading, error, data } = useQuery(GET_ALL_USERS);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    // if(data) console.debug(data)
  
  return (
    <Box
        backgroundColor={"#f7f7f7"}
        height={"100vh"}
        width={"250px"}
        padding={"10px"}

    >
        <Stack
            direction={"row"}
            justifyContent={"space-between"}
        >
            <Typography 
                variant="h6"
            >Chat</Typography>
            <LogoutIcon onClick={()=>{
                 localStorage.removeItem('jwt')
                 setloggedIn(false)
             }}/>

        </Stack>
        <Divider />
        {
            data && data.users.map((item, index) => {
                return <UserCard  item={item} key={index}/>
            })
        }
    </Box>
  )
}

export  default SideBar;