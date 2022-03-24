import {
    TableCell,
    TableRow,
    TableHead,
    Box,
    TableSortLabel,

} from "@mui/material";
import type { BitcoinList } from '../../app/services/bitcoin';
import { visuallyHidden } from '@mui/utils';
import { Order } from "../../types/Order";

interface HeadCell {
    disablePadding: boolean;
    id: keyof BitcoinList;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Name',
    },
    {
        id: 'symbol',
        numeric: false,
        disablePadding: false,
        label: 'Symbol',
    },
    {
        id: 'current_price',
        numeric: true,
        disablePadding: false,
        label: 'Current price',
    },
    {
        id: 'market_cap',
        numeric: true,
        disablePadding: false,
        label: 'Market Cap',
    },
    {
        id: 'price_change_percentage_1h_in_currency',
        numeric: true,
        disablePadding: false,
        label: '1h',
    },
    {
        id: 'price_change_percentage_24h_in_currency',
        numeric: true,
        disablePadding: false,
        label: '24h',
    },
    {
        id: 'price_change_percentage_7d_in_currency',
        numeric: true,
        disablePadding: false,
        label: '7d',
    }
];



interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof BitcoinList) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler =
        (property: keyof BitcoinList) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    return (
        <TableHead>
            <TableRow>    
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                            sx={headCell.label === 'Name' ? { paddingLeft: '0.5rem' } : null}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell
                    align={'left'}
                    key={'detail'}
                >
                    <TableSortLabel>  
                    </TableSortLabel>
                </TableCell>
            </TableRow>
        </TableHead>
    );
}