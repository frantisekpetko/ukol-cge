import React, { Fragment, useState } from 'react';
import {
    TableCell,
    TableBody,
    TableRow,
    TableContainer,
    Table,
    Paper,
    Grid,
    Box,
    Avatar,
    Pagination,
    Typography
} from "@mui/material";

import { useGetBitcoinListQuery } from '../app/services/bitcoin';
import type { BitcoinList } from '../app/services/bitcoin';
import { Link } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import currencyFormatter from 'currency-formatter';

import { EnhancedTableHead } from '../components/BitcoinTable/EnahncedTableHead';
import { Order } from '../types/Order';
import TableContentLoader from '../components/BitcoinTable/TableContentLoader';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}


function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export default function EnhancedTable() {

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof BitcoinList>('name');
    const [selected, setSelected] = React.useState<readonly string[] | undefined | null>([]);
    const [page, setPage] = React.useState(0);

    const { data, isLoading } = useGetBitcoinListQuery(page);

    console.log(data !== undefined ? data : null);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof BitcoinList,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelecteds = data && data.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const isSelected = (name: string) => selected?.indexOf(name) !== -1;

    const selectedLength = selected ? selected.length : 0;
  
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="h4" className="list-heading">Cryptocurrencies</Typography>
            <Box sx={{ width: '85%', backgroundColor: '#d3d3d3' }}>
                {isLoading
                    ? <TableContentLoader />
                    : <Paper sx={{ width: '100%' }}>

                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750, backgroundColor: '#fafafa' }}
                                aria-labelledby="tableTitle"
                                size={'medium'}
                            >
                                <EnhancedTableHead
                                    numSelected={selectedLength}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={data ? data.length : 0}
                                />
                                <TableBody>
                                    {data &&
                                        stableSort(data !== undefined ? data : [], getComparator(order, orderBy)).map((row, index) => {
                                            const isItemSelected = isSelected(row.name);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            const { image, name, circulating_supply, market_cap, total_supply, current_price, ath, price_change_percentage_1h_in_currency, price_change_percentage_24h_in_currency, price_change_percentage_7d_in_currency } = row;
                                            console.log('row', row);
                                            const market_cup_in_usd = currencyFormatter.format(market_cap, { code: 'USD' });
                                            const state = {
                                                market_cap: market_cup_in_usd,
                                                current_price: currencyFormatter.format(current_price, { code: 'USD' }),
                                                ath: currencyFormatter.format(ath, { code: 'USD' }),
                                                price_change_percentage_1h_in_currency: price_change_percentage_1h_in_currency,
                                                price_change_percentage_24h_in_currency: price_change_percentage_24h_in_currency,
                                                price_change_percentage_7d_in_currency: price_change_percentage_7d_in_currency,
                                                total_supply: total_supply,
                                                circulating_supply: circulating_supply,
                                                name: name,
                                                image: image

                                            };

                                            const oneHour = `${row.price_change_percentage_1h_in_currency.toFixed(2)}`;
                                            const twentyFourHours = `${row.price_change_percentage_24h_in_currency.toFixed(2)}`;
                                            const sevenDays = `${row.price_change_percentage_24h_in_currency.toFixed(2)}`;
                                            //console.log(row.symbol.charAt(0) === '-' || row.symbol.charAt(3) === '0' ? 'red' : 'green');
                                            return (
                                                <TableRow
                                                    hover

                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.name}
                                                    selected={isItemSelected}
                                                >

                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    >
                                                        <Grid
                                                            container
                                                            direction="row"
                                                            justifyContent="flex-start"
                                                            alignItems="center"
                                                        ><Avatar alt="Remy Sharp" src={row.image} className={'table-image'} />{row.name}</Grid>
                                                    </TableCell>

                                                    <TableCell align="left" >{row.symbol}</TableCell>
                                                    <TableCell align="right">{currencyFormatter.format(row.current_price, { code: 'USD' })}</TableCell>
                                                    <TableCell align="right">{currencyFormatter.format(row.market_cap, { code: 'USD' })}</TableCell>
                                                    <TableCell align="right" className={oneHour.charAt(0) === '-' || (oneHour.charAt(2) === '0' && oneHour.charAt(0) === '0') ? 'red' : 'green'}>{oneHour}%</TableCell>
                                                    <TableCell align="right" className={twentyFourHours.charAt(0) === '-' || (twentyFourHours.charAt(2) === '0' && twentyFourHours.charAt(0) === '0') ? 'red' : 'green'}>{twentyFourHours}%</TableCell>
                                                    <TableCell align="right" className={sevenDays.charAt(0) === '-' || (sevenDays.charAt(2) === '0' && sevenDays.charAt(0) === '0') ? 'red' : 'green'}>{sevenDays}%</TableCell>
                                                    <TableCell align="left">
                                                        <Link
                                                            to={`/detail/${row.id}`}
                                                            className={'eye-icon-link'}
                                                            state={state}>
                                                            <RemoveRedEyeIcon className={'detail-icon'} />
                                                        </Link>
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination
                            count={(stableSort(data !== undefined ? data : [], getComparator(order, orderBy))).length}
                            style={{
                                padding: 20,
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                            }}

                            onChange={(_, value) => {
                                setPage(value);
                            }}
                        />
                    </Paper>                
                    }                     
            </Box>
            </Grid>
    );
}

