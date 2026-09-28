import { useState } from 'react';
import { benchmarkPdf } from '../api/apiClient';

export const useBenchmark = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const runBenchmark = async (file) => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const result = await benchmarkPdf(file);
            setData(result);
        } catch (err) {
            setError(err.message || 'An error occurred during benchmarking');
        } finally {
            setIsLoading(false);
        }
    };

    return { runBenchmark, data, isLoading, error };
};
