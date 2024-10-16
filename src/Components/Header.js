import * as React from 'react';

import {AppBar,Container,Toolbar,Typography,Select,MenuItem} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CryptoState } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';

import { Link } from 'react-router-dom';
import UserSidebar from './Authentication/UserSidebar';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Header() {
  const {currency,setCurrency,user}= CryptoState();
  return(
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <AppBar color='transparent' position='static'>
      <Container>
        <Toolbar>
          <Typography sx={{ color: "gold",fontWeight:"bold",fontFamily:"Montserrat",variant:"h6" }}> <Link to={'/'}>Crypt-on</Link></Typography>
          <Select variant='outlined'
          style={{
            width:100,
            height:40,
            marginLeft:15,
          }}
          value={currency}
          onChange={(e)=>setCurrency(e.target.value)}
          >
            <MenuItem value={'USD'}>USD</MenuItem>
            <MenuItem value={'INR'}>INR</MenuItem>
          </Select>

          {user ?<UserSidebar />:<AuthModal />}
        
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  );
}
