import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Box, Typography } from '@mui/material';
import { CryptoState } from '../CryptoContext';
import { TrendingCoins } from '../config api/api';

export function numberWithCommas(x = 0) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


const Carousal = () => {
  const [trending, setTrending] = useState([]);
  const [error, setError] = useState("");
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = useCallback(async () => {
    setError("");
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    } catch (error) {
      setTrending([]);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Unable to load trending coins."
      );
    }
  }, [currency]);

  useEffect(() => {
    fetchTrendingCoins();
  }, [fetchTrendingCoins]);

  const items = trending.map((coin) => {
    const profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Box key={coin.id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <a href={`/coins/${coin.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <img
            src={coin?.image}
            alt={coin.name}
            height="80"
            style={{ marginRight: 10 }}
          />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {coin?.symbol}&nbsp;
            <span
              style={{
                color: profit ? 'rgb(14, 203, 129)' : 'red',
                fontWeight: 500,
              }}
            >
              {profit && '+'}
              {coin?.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 22, fontWeight: 500 }}>
            {symbol} {numberWithCommas(coin?.current_price?.toFixed(2) || "0.00")}
          </Typography>
        </a>
      </Box>
    );
  });

  const responsive = {
    0: { items: 2 },
    600: { items: 4 },
  };

  return (
    <Box sx={{ height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {error ? (
        <Typography variant="body2">{error}</Typography>
      ) : (
        <AliceCarousel
          mouseTracking
          infinite
          autoPlayInterval={1000}
          animationDuration={1500}
          disableDotsControls
          disableButtonsControls
          responsive={responsive}
          items={items}
          autoPlay
        />
      )}
    </Box>
  );
};

export default Carousal;
