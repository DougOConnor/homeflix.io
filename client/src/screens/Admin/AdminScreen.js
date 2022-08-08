import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import Page from '../../components/Page'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import UserTable from '../../components/Admin/UserTable'
import {readUserData} from '../../utils/storage'

import './Admin.css'

const cardStyle ={marginTop: 24}

const AdminScreen = (props) => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        axios.get(
          '/api/v1/settings/info'
        ).then(response => {
          setInfo(response.data)
        })
      }, [])
    
    const updateInfo = () => {
        let userData = readUserData()
        axios.post(
            '/api/v1/settings/info',
            info,
            {
                headers: {
                    "Authorization": "Bearer " + userData.token
                }
            }
        ).then(response => {
            window.location.reload()
        })
    }

    const theaterNameChangeHandler = (e) => {
        setInfo({...info, theaterName: e.target.value})
    }

    return (
        <Page>
        <div  >
            <Card style={cardStyle}>
                <CardHeader title="Theater Info">
                </CardHeader>
                <CardContent>
                <table className="form">
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            Theater Name
                            </Typography>
                        </td>
                        <td>
                        <TextField
                            style={{
                                width: '100%',
                                marginTop: 8
                            }}
                            //label="Search"
                            variant="standard"
                            onChange={theaterNameChangeHandler}
                            value={info.theaterName}
                            />
                        </td>
                    </tr>
                </table>
                </CardContent>
                <CardActions style={{justifyContent: 'flex-end'}}>
                    <Button variant='contained' onClick={updateInfo}>Save</Button>
                </CardActions>
            </Card>
            <Card style={cardStyle}>
                <CardHeader title="Users"></CardHeader>
                <CardContent>
                <UserTable />
                </CardContent>
            </Card>
        </div>
        </Page>
    )
}

export default AdminScreen