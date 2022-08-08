import * as React from 'react';
import Box from '@mui/material/Box';
import {
    Button,
    IconButton
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';



export default function DataGridDemo() {

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
      axios.get('/api/v1/user/all')
        .then(res => {
        setRows(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const columns = [
    { field: 'user_id', headerName: 'ID', width: 90 },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
    },
    {
      field: 'is_admin',
      headerName: 'Admin',
      width: 150,
      renderCell: (rowData) => {
        return rowData.row.is_admin ? 'Yes' : 'No';
      }
    },
    {
      field: 'resetPassword',
      headerName: 'Reset Password',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      renderCell: (rowData) =>
        <Button variant="contained" onClick={() => {axios.post("/api/v1/user/reset-password", {user_id: rowData.row.user_id}).then(()=> getUsers())}  } >Reset Password</Button>,
    },
    {
      field: 'reset_link',
      headerName: 'Reset Link',
      renderCell: (rowData) => {
        return rowData.row.reset_token ? <IconButton onClick={() => navigator.clipboard.writeText(window.location.host + "/reset-password?token=" + rowData.row.reset_token )}><ContentCopyIcon /></IconButton> : null
      }

    }
  ];


  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.user_id}
        //checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}