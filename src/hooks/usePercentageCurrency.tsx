import React from 'react';



const usePercentageCurrency = (value: number) => {

    const [className, setClassName] = React.useState('');
    const [percentageRoundedValue, setPercentageRoundedValue] = React.useState <string | null> (null);

    React.useEffect(() => {
        const val = `${parseFloat(value + '').toFixed(2)}`;
        setPercentageRoundedValue(val);
        setClassName(
            val?.charAt(0) === '-' ||
            (
                val?.charAt(2) === '0'
                && val?.charAt(0) === '0'
            )
            ? 'red' : 'green');

    }, [value])

    return { className, percentageRoundedValue};
}

export { usePercentageCurrency };