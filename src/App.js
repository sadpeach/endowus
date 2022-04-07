import './App.css';
import React, { useEffect, useState } from 'react';
import Chart from './Components/Chart/chart';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';

function App() {

  const baseURL = "http://www.mocky.io/v2/5e69de892d00007a005f9e29?mocky-delay=2000ms"
  const [initialInvestment, setInitalInvestment] = useState(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [backDropOpen, setBackDropOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {

    setBackDropOpen(true)

    let result = {
      "initialInvestment": initialInvestment,
      "montlyInvestment": monthlyInvestment
    };


    async function getData() {
      console.log("value entered:", result)
      try {
        const response = await axios.post(baseURL, result);
        setData(response.data)
        setBackDropOpen(false)
      } catch (e) {
        console.error("axios fetching failed" + e)
      }

    }

    getData()

  }, [initialInvestment, monthlyInvestment]);

  return (

    <div className="App">
      {/* {console.log("data retrieved at app:" + JSON.stringify(data))} */}
      <Stack spacing={2}>

        <Grid item>
          <Stack spacing={2}>
            <h1>Plan Projection</h1>
            <p>This is an illustration of your plan.</p>
          </Stack>
        </Grid>

        <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item>
            <TextField id="outlined-basic" label="Initial Investment" variant="outlined" onChange={e => setInitalInvestment(e.target.value)} />
          </Grid>

          <Grid item>
            <TextField id="outlined-basic" label="Monthly Investment" variant="outlined" onChange={e => setMonthlyInvestment(e.target.value)} />
          </Grid>
        </Grid>

        {/* set up backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backDropOpen}
        >
          <CircularProgress />
          <Grid item xs={12}>
          </Grid>
        </Backdrop>

        {/* set up chart */}
        <Chart data={data} />

      </Stack>

    </div>

  );
}

export default App;
