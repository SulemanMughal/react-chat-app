import React, { useState, useRef } from "react"

import { Box, Stack , Typography, TextField, Button , Card , CircularProgress, Alert
} from "@mui/material"

import { gql, useMutation } from '@apollo/client';


import { SINGUP_USER,LOGIN_USER } from "../graphql/mutations"

const AuthScreen = ({setloggedIn}) => {
    const [formData, setFormData] = useState({})
    const [showLogin, setShowLogin] = useState(true)
    const authForm = useRef(null)

    const [signupUser, { data, loading, error }] = useMutation(SINGUP_USER);
    const [loginInUser, { data:loginUser, loading:l2, error:e2 }] = useMutation(LOGIN_USER,{
        onCompleted: (data) => {
            localStorage.setItem("jwt", data.signInUser.token)
            setloggedIn(true)
        }
    });



    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(formData)
        if(showLogin){
            // login
            loginInUser({
                variables: {
                    userSignIn: formData
                }
            })
        } else{
            // signup
            signupUser({
                variables: {
                    userNew: formData
                }
            })
        }
    }


    if (loading || l2){
        return (
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                height={"100vh"}
            >
                <Box 
                    textAlign={"center"}
                >
                    <CircularProgress />
                    <Typography variant="h6">Authenticating...</Typography>
                </Box>
            </Box>
        )
    };

    return (
        <Box
            component={"form"}
            onSubmit={handleSubmit}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"80vh"}
            ref={authForm}
        >

            <Card
            
                variant="outlined"
                sx={{padding : "10px"}}
            >

                <Stack
                    sx={{width:"400px"}}
                    direction={"column"}
                    spacing={2}

                >
                    {data && (
                        <Alert severity="success">
                            {data.signupUser.firstName} is successfully registered
                        </Alert>
                    )}

                    {loginUser && (
                        <Alert severity="success">
                            User login successfully
                        </Alert>
                    )}
                    
                    {error && (
                        <Alert severity="error">
                            {error.message} 
                        </Alert>
                    )}
                    {e2 && (
                        <Alert severity="error">
                            {e2.message} 
                        </Alert>
                    )}
                    
                    <Typography variant="h5">
                        Please {showLogin ? "Login" : "Signup"}
                    </Typography>

                {
                    !showLogin && (
                        <>
                            <TextField
                                name="firstName"
                                label="First Name"
                                variant="standard"  
                                onChange={handleChange}
                            />
                            <TextField
                                name="lastName"
                                label="Last Name"
                                variant="standard"  
                                onChange={handleChange}
                            />
                        </>
                    )}

                    
                    
                    <TextField
                        type="email"
                        name="email"
                        label="email"
                        variant="standard"  
                        onChange={handleChange}
                    />
                    <TextField
                        type="password"
                        name="password"
                        label="password"
                        variant="standard"  
                        onChange={handleChange}
                    />
                    <Typography
                        variant="subtitle1"
                        textAlign={"center"}
                        onClick={() => {
                            setShowLogin((preValue) => !preValue)
                            setFormData({})
                            authForm.current.reset()
                        }}
                    >
                        {showLogin ? "Signup?" : "Login?"}
                    </Typography>
                    <Button variant="outlined" type="submit">
                        {showLogin ? "Login" : "Signup"}
                    </Button>
                </Stack>

            </Card>

        </Box>
    )
}


export default AuthScreen;