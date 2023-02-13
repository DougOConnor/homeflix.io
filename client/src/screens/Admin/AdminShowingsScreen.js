import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import Page from '../../components/Page'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Button } from '@mui/material';
import ShowingsTable from '../../components/Admin/ShowingsTable'
import AdminBase from './AdminBase';

const cardStyle ={marginTop: 24}


const AdminScreen = (props) => {
    const navigate = useNavigate()

    return (
        <AdminBase>
        <div  >
            <Card style={cardStyle}>
                <CardHeader title="Showings"></CardHeader>
                <CardContent>
                <ShowingsTable />
                </CardContent>
                <CardActions>
                    <div style={{width: "100%", display: 'flex', justifyContent: 'flex-end'}}>
                        <Button id="add-showing-button" variant="contained" onClick={() => navigate("/add-showing")}>Add Showing</Button>
                    </div>
                </CardActions>
            </Card>
        </div>
        </AdminBase>
    )
}

export default AdminScreen