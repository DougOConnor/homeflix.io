import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';

export default function SnackCard(props) {
    console.log(props)
  return (
    <Card sx={{ height: "100%" }} style={{position: 'relative'}}>
      <CardMedia
        component="img"
        height="140"
        src={props.data.picture}
      />
      <CardContent>
        <Typography gutterBottom variant="body1" component="div" style={{marginBottom: 20}}>
          {props.data.name}
        </Typography>
      </CardContent>
      <div style={{position: 'absolute', bottom: 0}}>
        <Button size="small" onClick={props.selected ? props.removeItem : props.addItem}>
            { props.selected ? <CheckIcon height={25} /> : <AddShoppingCartIcon height={25}/> }
        </Button>
      </div>
      
    </Card>
  );
}