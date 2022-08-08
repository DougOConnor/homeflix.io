import React from 'react';
import Grid from '@mui/material/Grid';
import Navbar from '../components/Navbar'

const Page = (props) => {

    return (
      <div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8} md={6} lg={6} >
            {props.children}
          </Grid>
        </Grid>
      </div>
        
    )
}

export default Page