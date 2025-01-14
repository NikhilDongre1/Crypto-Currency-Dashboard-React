import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import CoinInfo from "../Components/CoinInfo";
import { SingleCoin } from "../config api/api";
import { numberWithCommas } from "../Components/CoinsTable";
import { CryptoState } from "../CryptoContext";
import { useTheme, LinearProgress, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, watchlist,setWatchlist } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  const inWatchlist = watchlist?.includes(coin?.id);

  useEffect(() => {
    fetchCoin();
  }, [id]);

  const theme = useTheme();

  const Container = styled('div')({
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
      padding: 10,
    },
    padding: 20,
  });

  const Sidebar = styled('div')({
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
      alignItems: "center",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
    paddingRight: 20,
    [theme.breakpoints.down("sm")]: {
      borderRight: "none",
      paddingRight: 0,
    },
  });

  const Heading = styled(Typography)({
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
    textAlign: "center",
    fontSize: "2rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
  });

  const Description = styled(Typography)({
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
    [theme.breakpoints.down("sm")]: {
      padding: 10,
    },
  });

  const MarketData = styled('div')({
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      padding: 10,
    },
  });

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;
  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist ? [...watchlist, coin?.id] : [coin?.id] },
        { merge: true }
      );

      alert(`${coin.name} Added to the Watchlist !`);
    } catch (error) {
      alert(error.message);
    }
  };

  const removeFromWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

     alert(`${coin.name} Removed from the Watchlist !`);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <Container>
      <Sidebar>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20, maxWidth: "100%" }}
        />
        <Heading variant="h3">{coin?.name}</Heading>
        <Description variant="subtitle1">
          {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
        </Description>
        <MarketData>
          <span style={{ display: "flex" }}>
            <Heading variant="h5">Rank:</Heading>
            &nbsp;&nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {numberWithCommas(coin?.market_cap_rank)}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Heading variant="h5">Current Price:</Heading>
            &nbsp;&nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {symbol}{" "}
              {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}
            </Typography>
          </span>

          <span style={{ display: "flex" }}>
            <Heading variant="h5">Market Cap:</Heading>
            &nbsp;&nbsp;
            <Typography
              variant="h5"
              style={{ fontFamily: "Montserrat" }}
            >
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6)
              )}
              M
            </Typography>
          </span>

          {user && (
            <Button
              variant="outlined"
              style={{
                width: "100%",
                height: 40,
                color: "black",
                backgroundColor: inWatchlist ? "#ff0000" : "#EEBC1D",
                marginTop: 20,
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </MarketData>
      </Sidebar>
      <CoinInfo coin={coin} />
    </Container>
  );
};

export default CoinPage;
