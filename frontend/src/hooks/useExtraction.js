import { useState } from 'react';
import { extractPdf } from '../api/apiClient';

export const useExtraction = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeExtraction = async (file) => {
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await extractPdf(file);
            setData(responseData);
        } catch (err) {
            setError(err.message || 'An error occurred during extraction');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
    };

    return { executeExtraction, data, isLoading, error, reset };
};
