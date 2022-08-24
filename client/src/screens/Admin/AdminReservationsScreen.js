import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import Page from '../../components/Page'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Button } from '@mui/material';
import ReservationTable from '../../components/Admin/ReservationsTable'
import AdminBase from './AdminBase';

const cardStyle ={marginTop: 24}


const AdminReservationsScreen = (props) => {
    const navigate = useNavigate()

    return (
        <AdminBase>
        <div  >
            <Card style={cardStyle}>
                <CardHeader title="Reservations"></CardHeader>
                <CardContent>
                <ReservationTable />
                </CardContent>
                <CardActions>
                    <div style={{width: "100%", display: 'flex', justifyContent: 'flex-end'}}>
                    </div>
                </CardActions>
            </Card>
        </div>
        </AdminBase>
    )
}

export default AdminReservationsScreen