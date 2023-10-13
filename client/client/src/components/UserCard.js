import React from 'react'

// import { Box, Typography } from "@mui/material"

import { Stack, Avatar, Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom'

const UserCard = ({item : {firstName, lastName, id}}) => {

    const navigate = useNavigate()

  return (
    <Stack
        className='usercard'
        direction={"row"}
        alignItems={"center"}
        spacing={2}
        sx={{padding:"10px"}}
        onClick={() => navigate(`/${id}/${firstName}-${lastName}`)}
    >
        <Avatar  
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`} 
            sx={{width:"32px", height:"32px"}}
        />
        <Typography variant="subtitle2">{firstName} {lastName}</Typography>
    </Stack>
  )
}

export  default UserCard;