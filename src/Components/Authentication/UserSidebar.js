import React, { useState } from "react";
import { Avatar, Drawer, Button, Box, Typography , Card, CardContent, Grid, IconButton } from "@mui/material";

import { CryptoState } from "../../CryptoContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { numberWithCommas } from "../../Components/CoinsTable";
import { doc, setDoc } from "firebase/firestore";
import { AiFillDelete } from "react-icons/ai";


export default function UserSidebar() {
  const [state, setState] = useState({ right: false });
  const { user, watchlist, coins, symbol } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    signOut(auth);
    alert("log out successfully");
    toggleDrawer();
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );
      alert(`${coin.name} Removed from the Watchlist!`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            sx={{
              height: 38,
              width: 38,
              ml: 2,
              cursor: "pointer",
              backgroundColor: "#EEBC1D",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <Box
              p={3}
              sx={{
                width: 350,
                display: "flex",
                flexDirection: "column",
                fontFamily: "monospace",
                gap: 2,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 200,
                    height: 200,
                    cursor: "pointer",
                    backgroundColor: "#EEBC1D",
                  }}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <Typography
                  sx={{
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "grey",
                    borderRadius: 1,
                    p: 2,
                    overflowY: "scroll",
                  }}
                >
                  <Typography variant="h6" sx={{ textShadow: "0 0 5px black" }}>
                    Watchlist
                  </Typography>
                  {coins.map((coin) => {
        if (watchlist.includes(coin.id)) {
          return (
            <Grid item xs={10} sm={6} md={2} key={coin.id}>
              <Card sx={{ backgroundColor: "black", boxShadow: 3 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    px:1,
                    py: 0,
                    m:0,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {coin.name}
                    </Typography>
                    <Typography variant="body2">
                      {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                    </Typography>
                  </div>
                  <IconButton
                    onClick={() => removeFromWatchlist(coin)}
                    sx={{ color: "#f50057" }}
                  >
                    <AiFillDelete />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          );
        } else return null;
      })}
                </Box>
              </Box>

              <Button
                variant="contained"
                onClick={logOut}
                sx={{
                  mt: 2,
                  backgroundColor: "#EEBC1D",
                }}
              >
                Log Out
              </Button>
            </Box>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
