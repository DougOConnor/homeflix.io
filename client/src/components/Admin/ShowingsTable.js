import * as React from 'react';
import Box from '@mui/material/Box';
import {
    Button,
    IconButton
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

import MoviePoster from '../MoviePoster';
import { Grid, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField'

import MoreVertIcon from '@mui/icons-material/MoreVert';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import {readUserData} from '../../utils/storage'

function EditMenu(props) {
  const [datetime, setDateTime] = React.useState(props.showing.showing_datetime)


  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const [editDialogOpen, setEditOpenDialog] = React.useState(false);
  const handleEditDialogOpen = () => setEditOpenDialog(true);
  const handleEditDialogClose = () => {setEditOpenDialog(false);handleCloseDropdownMenu()}

  const [deleteDialogOpen, setDeleteOpenDialog] = React.useState(false);
  const handleDeleteDialogOpen = () => setDeleteOpenDialog(true);
  const handleDeleteDialogClose = () => {setDeleteOpenDialog(false);handleCloseDropdownMenu()}

  const handleOpenDropdownMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseDropdownMenu = () => {
    setAnchorElNav(null);
  };

  const datetimeChangeHandler = (e) => {
    console.log(e.format('MM-DD-YYYY HH:mm:SS'))
    setDateTime(e)
  }

  const updateShowing = () => {
    let userData = readUserData()
    axios.post(
      '/api/v1/showings/' + props.showing.showing_id,
      {
        showing_datetime: datetime
      },
      {
        headers: {
            "Authorization": "Bearer " + userData.token
        }
      })
      .then(res => {
        handleEditDialogClose()
        props.refreshShowings()
    })
    .catch(err => {
      console.log(err)
    })
  }

  const deleteShowing = () => {
    let userData = readUserData()
    axios.delete(
      '/api/v1/showings/' + props.showing.showing_id,
      {
        headers: {
            "Authorization": "Bearer " + userData.token
        }
      })
      .then(res => {
        handleDeleteDialogClose()
        props.refreshShowings()
    })
    .catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
    <Dialog
        open={deleteDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">
          Delete Screening
      </DialogTitle>
      <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the screening for {props.showing.title}?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleDeleteDialogClose} variant="outlined">Cancel</Button>
          <Button onClick={deleteShowing} autoFocus variant="contained" color="error">
          Delete
          </Button>
      </DialogActions>
    </Dialog>
    <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">
          Edit Screening
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <MoviePoster path={props.showing.poster_path} style={{width: "100%"}} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">{props.showing.title}</Typography>
            <DateTimePicker
            
            label="Showing Datetime"
            value={datetime}
            onChange={datetimeChangeHandler}
            renderInput={(params) => <TextField {...params} fullWidth style={{marginTop: 10}}/>}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleEditDialogClose} variant="outlined">Cancel</Button>
          <Button onClick={updateShowing} autoFocus variant="contained">
          Save
          </Button>
      </DialogActions>
    </Dialog>
    

    <IconButton onClick={handleOpenDropdownMenu}>
        <MoreVertIcon />
    </IconButton>
    <Paper sx={{maxWidth: '100%' }}>
      <Menu 
        anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseDropdownMenu}
        >
        <MenuItem onClick={handleEditDialogOpen}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteDialogOpen}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
    </div>
  );
}

export default function DataGridDemo() {

  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    getShowings()
  }, [])

  const getShowings = () => {
      axios.get('/api/v1/showings')
        .then(res => {
        setRows(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const columns = [
    { field: 'showing_id', headerName: 'ID'},
    {
        field: 'title',
        headerName: 'Title',
        flex: 1
    },
    {
        field: 'showing_datetime',
        headerName: 'Showing Datetime',
        flex: 1

    },
    {
      field: 'poster',
      headerName: 'Poster',
      renderCell: (rowData) => {
        return <MoviePoster path={rowData.row.poster_path} style={{height: 100}}/>
      }
    },
    {
        field: 'actions',
        headerName: 'Actions',
        renderCell: (rowData) => {
            return <EditMenu showing={rowData.row} refreshShowings={getShowings}/>
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
        getRowId={(row) => row.showing_id}
        //checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}