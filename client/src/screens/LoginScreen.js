import { useGoogleLogin } from 'react-google-login';
import { Grid, TextField, Snackbar, Alert } from '@mui/material';
import Google from '../assets/google.png'
import React, {useEffect, useState} from 'react';

import {readUserData, writeUserData} from '../utils/storage'
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
    isUsernameValid,
    getUsernameError,
    isPasswordValid,
    getPasswordError
} from '../utils/userValidation'

import axios from 'axios'

const inputElement = {
    marginBottom: 24
}
const button = {padding: "6px 24px", border: "solid black 1px", cursor: 'pointer'}

function LoginScreen(props) {
    const [backdropPath, setbackdropPath] = useState("")
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    

    const [newUsername, setNewUsername] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmNewPassword, setConfirmNewPassword] = useState()

    const [showNewUsernameError, setShowNewUsernameError] = useState(false)
    const [showNewPasswordError, setShowNewPasswordError] = useState(false)

    const [accountNotFoundError, setAccountNotFoundError] = useState(false)

    const [mode, setMode] = useState('login')
    const navigate = useNavigate()
    const [search, setSearch] = useSearchParams();

    const redirect = search.get('redirect')
    const token = search.get('token')

    useEffect(() => {
      axios.get(
        '/api/v1/tmdb/trending/movie'
      ).then(response => {
        let results = response.data.results.slice(0,10)
        const random = Math.floor(Math.random() * results.length)
        setbackdropPath(response.data.results[random].backdrop_path)
      })
    }, [])

      const signUp = () => {
        axios.post(
            "/api/v1/user",
            {
                username: newUsername,
                password: newPassword
            }
        ).then((response)=> {
            let data = response.data
            writeUserData(data.user_id, data.token, newUsername)
            props.setUser(data)
            navigate("/")
        })
      }

      const login = () => {
        axios.post(
            "/api/v1/auth/login",
            {
                username: username,
                password: password
            }
        ).then((response)=> {
            let data = response.data
                writeUserData(data.user_id, data.token, username)
                props.setUser(data)
                navigateToApp()
        }).catch((error) => {
            if (error.response.status === 401) {
                setAccountNotFoundError(true)
            }
        })
      }

      const resetPassword = () => {
        axios.post(
            "/api/v1/auth/reset-password",
            {
                password: newPassword,
                reset_token: token
            }
        ).then((response)=> {
            let data = response.data
            writeUserData(data.user_id, data.token, username)
            props.setUser(data)
            navigateToApp()
        })
      }

      const navigateToApp = () => {
        if (redirect) {
            navigate(redirect)
        } else {
            navigate("/")
        }
      }
    
    const handleNewUsernameChange = (value) => {
        setNewUsername(value)
        if (value.length > 3) {
            setShowNewUsernameError(true)
        }
    }

    const handleNewPasswordChange = (value) => {
        setNewPassword(value)
        setShowNewPasswordError(true)
    }

    return (
        <Grid container justifyContent={"center"} style={{width: "100%", height: "100%", padding: 20, backgroundImage:  'url(https://www.themoviedb.org/t/p/w1280/' + backdropPath + ')',backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh' }} direction="column">
            <Grid item textAlign={"center"}  style={{minHeight: "60%", display: 'flex', justifyContent: 'center'}}>
            <div style={{
                backgroundColor: 'white',
                maxWidth: 350,
                //display: 'flex', 
                flexDirection: "column", 
                justifyContent: 'center', 
                opacity: ".92", 
                color: 'black', 
                padding: 30,
                overflowY: 'scroll',
                paddingTop: 54
                }}>
                <h1 style={{marginTop: 0, display: 'block'}}>{props.info.theaterName}</h1>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: 30}}>
                    <div>
                        {
                            token !== undefined && token !== null ?
                            <div>
                            <TextField
                                    key="new-password"
                                    style={inputElement}
                                    label="New Password"
                                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                                    sx={{color: 'black'}}
                                    variant="standard" fullWidth
                                    type="password"
                                    error={showNewPasswordError ? !isPasswordValid(newPassword, confirmNewPassword): false}
                                    helperText={showNewPasswordError ? getPasswordError(newPassword, confirmNewPassword): null}
                                    >
                                    {newPassword}
                                </TextField>
                                <TextField
                                    key="confirm-password"
                                    style={inputElement}
                                    label="Confirm Password"
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    sx={{color: 'black'}}
                                    variant="standard"
                                    fullWidth
                                    type="password"
                                    >
                                    {confirmNewPassword}
                                </TextField>
                              <div style={{...button, ...inputElement}} onClick={() => resetPassword()}>
                                    Reset Password
                                </div>
                            </div>
                                : null
                        }
                        {
                            mode == 'login' && token == undefined ? 
                            <div>
                                <TextField
                                    id="username"
                                    key="username"
                                    style={inputElement}
                                    label="Username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{color: 'black'}} variant="standard"
                                    fullWidth
                                    >
                                    {username}
                                </TextField>
                                <TextField
                                    id="password"
                                    key="password"
                                    style={inputElement}
                                    label="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{color: 'black'}}
                                    variant="standard"
                                    fullWidth
                                    type="password"
                                    >
                                    {password}
                                </TextField>
                                <Alert
                                    visible={accountNotFoundError}
                                    style={{marginBottom: 20, display: accountNotFoundError ? 'flex' : 'none'}}
                                    severity="error"
                                    variant='outlined'
                                    onClose={()=> {setAccountNotFoundError(false)}}
                                    >
                                    Account not found or password incorrect
                                </Alert>

                              <div id="login-button" style={{...button, ...inputElement}} onClick={() => login()}>
                                    Login
                                </div>
                                <div style={{...inputElement, cursor: 'pointer', fontSize: 14}} onClick={() => setMode('create')}>
                                    Create Account
                                </div>
                            </div>
                            : null                
                            }
                            {
                                mode !== 'login' && token == undefined ?
                            <div>
                                <TextField
                                    key="new-username"
                                    style={inputElement}
                                    label="Username"
                                    //onChange={(e) => setNewUsername(e.target.value)}
                                    sx={{color: 'black'}}
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => handleNewUsernameChange(e.target.value)}
                                    error={showNewUsernameError ? !isUsernameValid(newUsername): false}
                                    helperText={showNewUsernameError ? getUsernameError(newUsername): null}
                                    >
                                    {newUsername}
                                </TextField>
                                <TextField
                                    key="new-password"
                                    style={inputElement}
                                    label="Password"
                                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                                    sx={{color: 'black'}}
                                    variant="standard" fullWidth
                                    type="password"
                                    error={showNewPasswordError ? !isPasswordValid(newPassword, confirmNewPassword): false}
                                    helperText={showNewPasswordError ? getPasswordError(newPassword, confirmNewPassword): null}
                                    >
                                    {newPassword}
                                </TextField>
                                <TextField
                                    key="confirm-password"
                                    style={inputElement}
                                    label="Confirm Password"
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    sx={{color: 'black'}}
                                    variant="standard"
                                    fullWidth
                                    type="password"
                                    >
                                    {confirmNewPassword}
                                </TextField>
                              <div style={{...button, ...inputElement}} onClick={() => signUp()}>
                                    Create Account
                                </div>
                                <div style={{...inputElement, cursor: 'pointer', fontSize: 14}} onClick={() => setMode('login')}>
                                    Already have an account? Login
                                </div>
                            </div>
                            : null
                        }
                        
                    </div>
                </div>
                
            </div>
            
            </Grid>
        </Grid>
    )
}

export default LoginScreen