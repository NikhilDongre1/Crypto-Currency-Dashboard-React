import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config api/api";
import { Line } from "react-chartjs-2"; 
import Chart from 'chart.js/auto';
import { CircularProgress, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { styled } from '@mui/system';
import { CryptoState } from "../CryptoContext";
import { chartDays } from "../config api/data";
import SelectButton from "./SelectButton";


const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setFlag] = useState(false);

  const fetchHistoricData = async () => {
    if (coin && coin.id) {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setFlag(true);
      setHistoricData(data.prices);
    }
  };

  useEffect(() => {
    fetchHistoricData();
  }, [days, coin]);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: "#fff",
      },
    },
  });

  const StyledContainer = styled('div')(({ theme }) => ({
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  }));

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StyledContainer>
        {!historicData || flag === false ? (
          <CircularProgress style={{ color: "gold" }} size={250} thickness={1} />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
                
                
              ))}
            </div>
          </>
        )}
      </StyledContainer>
    </ThemeProvider>
  );
};

export default CoinInfo;
