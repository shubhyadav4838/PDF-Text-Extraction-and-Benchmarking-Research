import { useState } from 'react';
import { uploadPdf } from '../api/apiClient';

export const usePdfUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleUpload = async (file) => {
        if (!file) return;
        
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await uploadPdf(file);
            setResult(data);
        } catch (err) {
            setError(err.message || 'An error occurred during upload');
        } finally {
            setIsLoading(false);
        }
    };

    return { upload: handleUpload, isLoading, error, result };
};
