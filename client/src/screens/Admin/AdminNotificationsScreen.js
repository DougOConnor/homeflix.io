import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { 
    CardHeader,
    Button,
    Typography,
    TextField,
    Switch,
    Snackbar,
    CircularProgress
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ShowingsTable from '../../components/Admin/ShowingsTable'
import AdminBase from './AdminBase';
import axios from 'axios';

import {readUserData} from '../../utils/storage'


const cardStyle ={marginTop: 24}

const AdminNotifications = (props) => {
    const navigate = useNavigate()
    const userData = readUserData()

    const [smtp_enabled, setSmtpEnabled] = useState(false)
    const [smtp_server, setSmtpServer] = useState("")
    const [smtp_username, setSmtpUsername] = useState("")
    const [smtp_password, setSmtpPassword] = useState("")
    const [smtp_port, setSmtpPort] = useState("")
    const [smtp_force_tls, setSmtpForceTls] = useState(false)
    const [smtp_from_email, setSmtpFromEmail] = useState("")
    const [smtp_from_display_name, setSmtpFromDisplayName] = useState("")
    const [smtp_test_recepient, setSmtpTestRecipient] = useState("")

    const [open_alert, setOpenAlert] = React.useState(false);
    const [alert_message, setAlertMessage] = React.useState("");
    const [alert_severity, setAlertSeverity] = React.useState("");

    const [test_activity, setTestActivity] = useState(false)


    const buildDict = () => {
        return {
            "smtp_enabled": smtp_enabled,
            "smtp_server": smtp_server,
            "smtp_username": smtp_username,
            "smtp_password": smtp_password,
            "smtp_port": smtp_port,
            "smtp_force_tls": smtp_force_tls,
            "smtp_from_email": smtp_from_email,
            "smtp_from_display_name": smtp_from_display_name,
            "smtp_test_recepient": smtp_test_recepient
        }
    }
    
    const testEmail =() => {
        const data = buildDict()
        setTestActivity(true)
        axios.post(
            '/api/v1/settings/test-email',
            data,
            {
                headers: {
                    "Authorization": "Bearer " + userData.token
                }
            }
        ).then(response => {
            setAlertMessage("Email Sent!")
            setAlertSeverity("success")
            setOpenAlert(true)
        }).catch(error => { 
            setAlertMessage(error.response.data.message)
            setAlertSeverity("error")
            setOpenAlert(true)
        }).finally(() => {
            setTestActivity(false)
        })
    }

    const saveSettings =() => {
        const data = buildDict()
        axios.post(
            '/api/v1/settings/email',
            data,
            {
                headers: {
                    "Authorization": "Bearer " + userData.token
                }
            }
        )
    }

    const handleAlertClose = (event, reason) => {
        setAlertMessage("")
        setAlertSeverity("")
        setOpenAlert(false)
    }

    useEffect(() => {
        axios.get(
            '/api/v1/settings/email', {headers: {"Authorization": "Bearer " + userData.token}}).then((response) => {
                setSmtpEnabled(response.data.smtp_enabled)
                setSmtpServer(response.data.smtp_server)
                setSmtpUsername(response.data.smtp_username)
                setSmtpPassword(response.data.smtp_password)
                setSmtpPort(response.data.smtp_port)
                setSmtpForceTls(response.data.smtp_force_tls)
                setSmtpFromEmail(response.data.smtp_from_email)
                setSmtpFromDisplayName(response.data.smtp_from_display_name)
                setSmtpTestRecipient(response.data.smtp_test_recepient)
            })
    }, [])

    return (
        <AdminBase>
        <Snackbar
            open={open_alert}
            autoHideDuration={6000}
            onClose={handleAlertClose}
        >
            <MuiAlert elevation={6} variant="filled" severity={alert_severity}>{alert_message}</MuiAlert>
        </Snackbar>
        <div>
            <Card style={cardStyle}>
                <CardHeader title="Email"></CardHeader>
                <CardContent>
                <table className="form">
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            Enable Email
                            </Typography>
                        </td>
                        <td>
                        <Switch onChange={(e) => setSmtpEnabled(e.target.checked)} checked={smtp_enabled}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            SMTP Server
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
                            onChange={(e) => setSmtpServer(e.target.value)}
                            value={smtp_server}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            SMTP Username
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
                            onChange={(e) => setSmtpUsername(e.target.value)}
                            value={smtp_username}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            SMTP Password
                            </Typography>
                        </td>
                        <td>
                        <TextField
                            style={{
                                width: '100%',
                                marginTop: 8
                            }}
                            type="password"
                            variant="standard"
                            onChange={(e) => setSmtpPassword(e.target.value)}
                            value={smtp_password}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            SMTP Port
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
                            onChange={(e) => setSmtpPort(e.target.value)}
                            value={smtp_port}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            Force TLS
                            </Typography>
                        </td>
                        <td>
                        <Switch onChange={(e) => setSmtpForceTls(e.target.checked)} checked={smtp_force_tls}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            From Email
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
                            onChange={(e) => setSmtpFromEmail(e.target.value)}
                            value={smtp_from_email}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            From Display Name
                            </Typography>
                        </td>
                        <td>
                        <TextField
                            style={{
                                width: '100%',
                                marginTop: 8
                            }}
                            variant="standard"
                            onChange={(e) => setSmtpFromDisplayName(e.target.value)}
                            value={smtp_from_display_name}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                        <Typography color="text.primary" >
                            Test Recipient
                            </Typography>
                        </td>
                        <td>
                        <TextField
                            style={{
                                width: '100%',
                                marginTop: 8
                            }}
                            variant="standard"
                            onChange={(e) => setSmtpTestRecipient(e.target.value)}
                            value={smtp_test_recepient}
                            />
                        </td>
                    </tr>
                </table>
                </CardContent>
                <CardActions>
                    <div style={{width: "100%", display: 'flex', justifyContent: 'flex-end'}}>
                        <Button id="add-showing-button" variant="outlined" onClick={() => testEmail()}>{test_activity ? <CircularProgress size={18}/> : "Test"}</Button>
                        <Button id="add-showing-button" variant="contained" onClick={() => saveSettings()}>Save</Button>
                    </div>
                </CardActions>
            </Card>
        </div>
        </AdminBase>
    )
}

export default AdminNotifications