import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Page from '../../components/Page'
import { Button } from '@mui/material';
import { TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { writeUserData } from '../../utils/storage';

import {
    isUsernameValid,
    getUsernameError,
    isPasswordValid,
    getPasswordError
} from '../../utils/userValidation'

const formElement = {
    marginBottom: 24
}


const AdminCreate = (props) => {
    const [username, setUsername] = useState("")
    const [showUsernameError, setShowUsernameError] = useState(false)
    const [password, setPassword] = useState("")
    const [showPasswordError, setShowPasswordError] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState()
    const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(false)
    const navigate = useNavigate()

    const saveInfo = () => {
        axios.post(
            "/api/v1/user",
            {
                username: username,
                password: password,
                is_admin: true
            }
        ).then((response) => {
            let data = response.data
            props.setUser(data)
            writeUserData(data.user_id, data.token, data.username)
            navigate("/setup/info")
        })
    }

    const handleUsernameChange = (value) => {
        setUsername(value)
        if (value.length > 3) {
            setShowUsernameError(true)
        }
    }

    const handlePasswordChange = (value) => {
        setPassword(value)
        setShowPasswordError(true)
    }

    const handleConfirmPasswordChange = (value) => {
        setConfirmPassword(value)
        setShowConfirmPasswordError(true)
    }


    return (
      <Page>
        
        <div style={{padding: 24}}>
        <h2 level="h2" >Welcome to Homeflix, please start by creating a administrator account</h2>
        
        <div style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <TextField
                id='username'
                style={formElement}
                label="Username"
                variant="standard"
                onChange={(e) => handleUsernameChange(e.target.value)}
                error={showUsernameError ? !isUsernameValid(username): false}
                helperText={showUsernameError ? getUsernameError(username): null}
                
                >
                {username}
            </TextField>
            <TextField
                id='password'
                style={formElement}
                label="Password"
                variant="standard"
                onChange={(e) => handlePasswordChange(e.target.value)}
                type="password"
                error={showPasswordError ? !isPasswordValid(password, confirmPassword): false}
                helperText={showPasswordError ? getPasswordError(password, confirmPassword): null}
                >
                {password}
            </TextField>
            <TextField 
                id='confirm-password'
                style={formElement}
                label="Confirm Password"
                variant="standard"
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                type="password"
                //error={showConfirmPasswordError ? !isPasswordValid(password, confirmPassword): false}
                //helperText={showConfirmPasswordError ? getPasswordError(confirmPassword, password): null}
                >
                {confirmPassword}
            </TextField>
        
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 48}}>
            <Button
                id="create-admin-account-button"
                variant='contained'
                onClick={() => saveInfo()}
                disabled={password !== confirmPassword || password.length < 1} 
                >
                Save
            </Button>
        </div>
        </div>
      </Page>
    )
}

export default AdminCreate