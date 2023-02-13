import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Page from '../../components/Page'
import { Button } from '@mui/material';
import { TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { readUserData } from '../../utils/storage';


const TheaterInfoEditor = (props) => {
    const [theaterName, setTheaterName] = useState()
    const navigate = useNavigate()

    const saveInfo = () => {
        const userData = readUserData()
        axios.post(
            "/api/v1/settings/info",
            {
                theaterName: theaterName
            },
            {
                headers: {
                    "Authorization": "Bearer " + userData.token
                }
            }
        ).then(() => {
            console.log("refreshing")
            navigate("/setup/layout")
        })
    }

    const theaterNameChangeHandler = (e) => {
        setTheaterName(e.target.value)
    }


    return (
      <Page>
        
        <div style={{padding: 24}}>
        <h2 level="h2" >Welcome, please enter the name of your theater, this will appear in your app's navbar on every page</h2>
        
        <div style={{
            marginTop: 48,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <TextField
                id="theater-name-input"
                label="Theater Name"
                variant="standard"
                onChange={(name) => theaterNameChangeHandler(name)}
                >
                {theaterName}
            </TextField>
        
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 48}}>
            <Button id="save-theater-info" variant='contained' onClick={() => saveInfo()} >Save</Button>
        </div>
        </div>
      </Page>
    )
}

export default TheaterInfoEditor