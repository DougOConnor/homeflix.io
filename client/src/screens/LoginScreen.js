import { useGoogleLogin } from 'react-google-login';
import { Grid, TextField, Snackbar, Alert } from '@mui/material';
import Google from '../assets/google.png'
import React, {useEffect, useState} from 'react';
import validator from 'validator'

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
const button = {padding: "6px 24px", border: "solid black 1px"}

function LoginScreen(props) {
    const [backdropPath, setbackdropPath] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    

    const [newUsername, setNewUsername] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmNewPassword, setConfirmNewPassword] = useState()
    const [newEmail, setNewEmail] = useState()

    const [showNewUsernameError, setShowNewUsernameError] = useState(false)
    const [showNewPasswordError, setShowNewPasswordError] = useState(false)
    const [showNewEmailError, setShowNewEmailError] = useState(false)

    const [accountNotFoundError, setAccountNotFoundError] = useState(false)
    const [resetPasswordSent, setResetPasswordSent] = useState(false)

    const [emailEnabled, setEmailEnabled] = useState("")

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

      axios.get(
        '/api/v1/settings/email'
      ).then(response => {
        setEmailEnabled(response.data.smtp_enabled)
      })
    }, [])

      const signUp = () => {
        axios.post(
            "/api/v1/user",
            {
                username: newUsername,
                password: newPassword,
                email: newEmail
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

      const startResetPassword = () => {
        axios.post(
            "/api/v1/user/reset-password",
            {
                username: username,
            }
        ).then((response)=> {
            setResetPasswordSent(true)
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

    const handleNewEmailChange = (value) => {
      setNewEmail(value)
      if (!validator.isEmail(value)) {
        setShowNewEmailError(true)
      } else {
        setShowNewEmailError(false)
      }
    }


    let validPasswordCheck = isPasswordValid(newPassword, confirmNewPassword)
    let usernameExists = username.length > 0
    let createAccountFormValid = validPasswordCheck && isUsernameValid(newUsername) && validator.isEmail(newEmail)
    let resetPasswordFormValid = validPasswordCheck

    return (
        <Grid container justifyContent={"center"} style={{width: "100%", height: "100%", padding: 20, backgroundImage:  'url(https://www.themoviedb.org/t/p/w1280/' + backdropPath + ')',backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh' }} direction="column">
            <Grid item textAlign={"center"}  style={{minHeight: "60%", display: 'flex', justifyContent: 'center'}}>
            <div style={{
                backgroundColor: 'white',
                width: 350,
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
                <div style={{display: 'flex', justifyContent: 'center', marginBottom: 30, width: '100%'}}>
                    <div style={{width: "100%"}}>
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
                              <div style={{
                                ...button,
                                ...inputElement,
                                cursor: resetPasswordFormValid ? 'pointer' : 'not-allowed',
                                backgroundColor: resetPasswordFormValid ? 'white' : 'lightgray',
                                color: resetPasswordFormValid ? 'black' : 'gray'
                                }} onClick={resetPasswordFormValid ? () => resetPassword() : null}>
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
                                    label="Username or Email"
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
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <div style={{...inputElement, cursor: 'pointer', fontSize: 14}} onClick={() => setMode('create')}>
                                    Create Account
                                </div>
                                {
                                    emailEnabled ?
                                    <div style={{...inputElement, cursor: 'pointer', fontSize: 14, marginLeft: 48}} onClick={() => setMode('reset')}>Reset Password
                                    </div>
                                    : null
                                }
                                
                                    
                                </div>
                            </div>
                            : null                
                            }
                            {
                                mode === 'create' && token == undefined ?
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
                                    key="new-email"
                                    style={inputElement}
                                    label="Email"
                                    //onChange={(e) => setNewUsername(e.target.value)}
                                    sx={{color: 'black'}}
                                    variant="standard"
                                    fullWidth
                                    onChange={(e) => handleNewEmailChange(e.target.value)}
                                    error={showNewEmailError ? "please enter a valid email address": false}
                                    helperText={showNewEmailError ? "please enter a valid email address": null}
                                    >
                                    {newEmail}
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
                              <div style={{
                                ...button,
                                ...inputElement,
                                cursor: createAccountFormValid ? 'pointer' : 'not-allowed',
                                backgroundColor: createAccountFormValid ? 'white' : 'lightgray',
                                color: createAccountFormValid ? 'black' : 'gray'
                                }} 
                                onClick={createAccountFormValid ? () => signUp() : null}
                                
                                >
                                    Create Account
                                </div>
                                <div style={{...inputElement, cursor: 'pointer', fontSize: 14}} onClick={() => setMode('login')}>
                                    Already have an account? Login
                                </div>
                            </div>
                            : null
                        }
                        {
                            mode === 'reset' && token == undefined ?
                            <div style={{width: "100%"}}>
                                <TextField
                                    id="username"
                                    key="username"
                                    style={inputElement}
                                    label="Username or Email"
                                    onChange={(e) => setUsername(e.target.value)}
                                    sx={{color: 'black'}} variant="standard"
                                    fullWidth
                                    >
                                    {username}
                                </TextField>
                                <div style={{
                                    ...button,
                                    ...inputElement,
                                    cursor: usernameExists ? 'pointer' : 'not-allowed',
                                    backgroundColor: usernameExists ? 'white' : 'lightgray',
                                    color: usernameExists ? 'black' : 'gray'
                                    }} 
                                    onClick={usernameExists ? () => startResetPassword() : null}
                                
                                >
                                    Reset Password
                                </div>
                                <div style={{...inputElement, cursor: 'pointer', fontSize: 14}} onClick={() => setMode('login')}>
                                    Back to Login
                                </div>
                                <Alert
                                    visible={resetPasswordSent}
                                    style={{marginBottom: 20, display: resetPasswordSent ? 'flex' : 'none'}}
                                    severity="info"
                                    variant='outlined'
                                    onClose={()=> {setResetPasswordSent(false)}}
                                    >
                                    An email has been sent to with a link to reset your password
                                </Alert>
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