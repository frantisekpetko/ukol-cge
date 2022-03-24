import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type BitcoinList = {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    market_cap: number;
    image: string;
    price_change_percentage_1h_in_currency: number;
    price_change_percentage_24h_in_currency: number;
    price_change_percentage_7d_in_currency: number;
    ath: number;
    total_supply: number;
    circulating_supply: number;

};

export type BitcoinDetail = {
    name: string;
    symbol: string;
    genesis_date: string;
    market_cap_rank: number;
    total_supply: number;
    circulating_supply: number;
    image: {
        small: string;
        thumbnail: string;
        large: string;
    };
    market_cap: number;
    current_price: number;
    ath: number;
    price_change_percentage_1h_in_currency: number;
    price_change_percentage_24h_in_currency: number;
    price_change_percentage_7d_in_currency: number;
}

export type BitcoinMarketChart = {
    date: string,
    price: number
};

export type RawBitcoinMarketChart = [
    number,
    number
][];

export const bitcoinApi = createApi({
    reducerPath: '',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3/coins/' }),

    endpoints: (builder) => ({
        getBitcoinList: builder.query<BitcoinList[] | undefined, number>({
            query: (page) => `markets?vs_currency=usd&per_page=7&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`,
            transformResponse: (rawResult: BitcoinList[], meta) => {
                console.log('refetch', meta?.request, rawResult);
                return rawResult;
            }

        }),
        getBitcoinDetail: builder.query<BitcoinDetail, string | undefined>({
            query: (bitcoinName) => `${bitcoinName}?sparkline=true`,
        }),
        getBitcoinMarketChart: builder.query<BitcoinMarketChart[], string | undefined>({
            query: (bitcoinName) => `${bitcoinName}/market_chart?vs_currency=usd&days=365`,
            transformResponse: (rawResult: { prices: RawBitcoinMarketChart }, meta) => {
                let array: any[] = [];
        
                rawResult.prices.map((itm) => {
                    let date = new Date(itm[0]);
                    let time =
                        date.getHours() > 12
                            ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                            : `${date.getHours()}:${date.getMinutes()} AM`;
                
                    array.push({ date: date.toLocaleDateString(), price: itm[1]})
                })
                console.log(array);
                return array;
            },
        })
    })
});

export const { useGetBitcoinListQuery, useGetBitcoinDetailQuery, useGetBitcoinMarketChartQuery } = bitcoinApi;
