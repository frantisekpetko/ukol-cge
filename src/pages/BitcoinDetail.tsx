import { Fragment } from "react";
import { useLocation, useParams, useNavigate } from "react-router"
import { useGetBitcoinDetailQuery, useGetBitcoinMarketChartQuery } from "../app/services/bitcoin";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { Paper, Typography, Grid  } from '@mui/material'
import { usePercentageCurrency } from "../hooks/usePercentageCurrency";
import { Button } from "@mui/material";
import DetailContentLoader from "../components/BitcoinDetail/DetailContentLoader";

Chart.register(...registerables)

export default function BitcoinDetail() {
    const navigate = useNavigate();
    const location: any = useLocation()
    const {symbol} = useParams();

    const { data, isLoading } = useGetBitcoinDetailQuery(symbol);
    const { data: chartData } = useGetBitcoinMarketChartQuery(symbol);

    const { className: className1h, percentageRoundedValue: percentageCurrency1h } = usePercentageCurrency(location?.state?.price_change_percentage_1h_in_currency);
    const { className: className24h, percentageRoundedValue: percentageCurrency24h } = usePercentageCurrency(location?.state?.price_change_percentage_24h_in_currency);
    const { className: className7d, percentageRoundedValue: percentageCurrency7d } = usePercentageCurrency(location?.state?.price_change_percentage_24h_in_currency);

    return <Fragment>
        <Grid
            
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start">
            <Button variant="contained" className={'go-back-btn'} onClick={() => navigate(-1)}>Go back to list</Button>
        </Grid>
  
        <Grid

            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
        {isLoading
                ? <DetailContentLoader />
                : <Paper className={'chart-container'} elevation={16} style={{ backgroundColor: '#fafafa' }}>
            
                 <Fragment>
                    <div className={'chart-info'}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            className={'space-bottom-customized heading-container'}
                        >
                            <img className={'heading-image'} src={location.state.image} alt="crypto image" />
                            <Typography variant="h4" gutterBottom component="div" className={'heading'}>
                                {location?.state?.name}
                            </Typography>
                        </Grid>
             
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">Symbol:</Typography><Typography>{data?.symbol !== null ? data?.symbol : '-'}</Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">Genesis date:</Typography><Typography>{data?.genesis_date ? data?.genesis_date : '-'}</Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">Market rank:</Typography><Typography>{data?.market_cap_rank !== null ? data?.market_cap_rank : '-'}</Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">Total supply:</Typography><Typography>{location?.state?.total_supply !== null ? location?.state?.total_supply : '-'}</Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">Circulating supply:</Typography><Typography>{location?.state?.circulating_supply !== null ? location?.state?.circulating_supply : '-' }</Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">Market Cap:</Typography><Typography>{location?.state?.market_cap !== null ? location?.state?.market_cap : '-' }</Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">Current price:</Typography><Typography>{location?.state?.current_price !== null ? location?.state?.current_price : '-' }</Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">All time high:</Typography><Typography>{location?.state?.ath !== null ? location?.state?.ath : '-' }</Typography>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2">1h change:</Typography><Typography className={className1h}>{percentageCurrency1h !== null ? `${percentageCurrency1h}%` : '-' }</Typography>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2" gutterBottom component="div">24h change:</Typography><Typography className={className24h}>{percentageCurrency24h !== null ? `${percentageCurrency24h}%` : '-'}</Typography>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            className={'space-bottom-customized'}
                        >
                            <Typography variant="subtitle2" gutterBottom component="div">7d change:</Typography><Typography className={className7d}>{percentageCurrency7d !== null ? `${percentageCurrency7d}%` : '-' }</Typography>
                        </Grid>
                </div>
                <Line
                    className={'chart'}
                    data={{
                        labels: chartData?.map((coin) => {
                            return coin.date;
                        }),
                        datasets: [
                            {
                                data: chartData?.map((coin) => `${coin.price}`),
                                label: `Price ( Past ${365} Days ) in ${'USD'}`,
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
                </Fragment>
 
                </Paper>
            }
        </Grid>
    </Fragment>
}