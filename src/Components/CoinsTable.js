import React, { useState } from 'react';
 

import { CryptoState } from '../CryptoContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import {
  Table,
  TableHead,
  TableContainer,
  TableRow,
  TableCell,
  Button,
  Container,
  LinearProgress,
  TextField,
  Typography,
  TableBody,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export function  numberWithCommas(x = 0) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const CoinsTable = () => {

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { symbol, coins, loading, coinError, fetchCoins } = CryptoState();
  const navigate = useNavigate();

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ textAlign: 'left' }}>
        <Typography variant="h4" sx={{ margin: 5, fontFamily: 'Montserrat' }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          sx={{ marginBottom: 2, width: '100%' }}
          id="outlined-basic"
          label="Search For a Crypto Currency"
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
        />

        <TableContainer>
          {loading ? (
            <LinearProgress style={{ backgroundColor: 'gold' }} />
          ) : coinError ? (
            <div style={{ padding: 24, textAlign: "center" }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                {coinError}
              </Typography>
              <Button variant="outlined" onClick={fetchCoins}>
                Retry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {['Coin', 'Price', '24h Change', 'Market Cap'].map((head) => (
                    <TableCell
                      key={head}
                      align={head === 'Coin' ? 'left' : 'right'}
                      style={{
                        color: 'black',
                        fontWeight: '700',
                        fontFamily: 'Montserrat',
                        backgroundColor: '#EEBC1D', // Set background color for header cells
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, page * 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        key={row.name}
                        onClick={() => navigate(`/coins/${row.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          <img src={row.image} alt={row.name} height="50"  />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ textTransform: 'uppercase', fontSize: 22 }}>{row.symbol}</span>
                            <span style={{ color: 'darkgrey' }}>{row.name}</span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol} {numberWithCommas(row.current_price?.toFixed(2) || "0.00")}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ color: profit ? 'rgb(14, 203, 129)' : 'red', fontWeight: 500 }}
                        >
                          {profit ? '+' : ''} {row.price_change_percentage_24h?.toFixed(2) || "0.00"}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol} {numberWithCommas((row.market_cap || 0).toString().slice(0, -6))}M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {!coinError && (
          <Pagination
            count={Math.ceil(handleSearch()?.length / 10)}
            style={{
              padding: 20,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }}
          />
        )}
     

      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
