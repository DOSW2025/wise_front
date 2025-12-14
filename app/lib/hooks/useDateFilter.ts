import { useState } from 'react';

export function useDateFilter(initialPeriod = 'last-month') {
	const [period, setPeriod] = useState<string>(initialPeriod);
	const [customDateStart, setCustomDateStart] = useState('');
	const [customDateEnd, setCustomDateEnd] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handlePeriodChange = (keys: any) => {
		const newPeriod = Array.from(keys)[0] as string;
		setPeriod(newPeriod);
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => setIsLoading(false), 1000);
	};

	const handleCustomFilter = () => {
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => setIsLoading(false), 1000);
	};

	return {
		period,
		customDateStart,
		setCustomDateStart,
		customDateEnd,
		setCustomDateEnd,
		isLoading,
		handlePeriodChange,
		handleCustomFilter,
	};
}
