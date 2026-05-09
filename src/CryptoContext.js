import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "./config api/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { onSnapshot, doc } from "firebase/firestore";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("\u20B9");
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coinError, setCoinError] = useState("");
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      const unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchlist(coin.data().coins);
        } else {
          setWatchlist([]);
        }
      });

      return () => {
        unsubscribe();
      };
    }

    setWatchlist([]);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });

    return unsubscribe;
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    setCoinError("");

    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (error) {
      setCoins([]);
      setCoinError(
        error.response?.data?.error ||
          error.message ||
          "Unable to load cryptocurrency market data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currency === "INR") setSymbol("\u20B9");
    else if (currency === "USD") setSymbol("$");

    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        coins,
        loading,
        coinError,
        fetchCoins,
        user,
        watchlist,
        setWatchlist,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
