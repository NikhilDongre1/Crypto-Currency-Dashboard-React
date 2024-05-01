import React from 'react'
import Box from '@mui/material/Box';
import { Container, Typography } from '@mui/material';
import Carousal from './Carousal';
const Banner = () => {
  return (
    <Box sx={{backgroundImage:"url(./banner2.jpg)",
    height:"400",
    display:"flex",
    flexDirection:"column",
    paddingTop:10,
    justifyContent:"space-around"}}>
        <Container>
            <div>
                <Typography variant='h2' sx={{
            fontWeight:"bold",
            marginBottom:1,  //changed
            fontFamily:"Montserrat",
            textAlign:"center"}}>Crypt-on</Typography>
                <Typography variant="subtitle2" sx={{
                    color:"darkgrey",
                    textTransform:"capitalize",
                    fontFamily:"Montserrat",
                    display:"flex",
                    height:"40%",
                    flexDirection:"column",
                    justifyContent:"center",
                    textAlign:"center"
                }}>
                    Get all the info reagarding your favorite Crypto Currency here.
                </Typography>
            </div>
            <Carousal  />
        </Container>
    </Box>
  )
}

export default Banner;
