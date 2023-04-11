import React from 'react';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar'

const Page = (props) => {

    return (
      <div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={10} md={10} lg={10} >
            {props.children}
          </Grid>
        </Grid>
      </div>
        
    )
}

export default Page