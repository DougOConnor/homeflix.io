import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Button } from '@mui/material';
import UserTable from '../../components/Admin/UserTable'
import AdminBase from './AdminBase';

const cardStyle ={marginTop: 24}


const AdminScreen = (props) => {
    return (
        <AdminBase>
        <div  >
            <Card style={cardStyle}>
                <CardHeader title="Users"></CardHeader>
                <CardContent>
                <UserTable />
                </CardContent>
            </Card>
        </div>
        </AdminBase>
    )
}

export default AdminScreen