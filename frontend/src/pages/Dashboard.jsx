import React from 'react';
import FileUploader from '../components/FileUploader';
import ResultCard from '../components/ResultCard';
import { usePdfUpload } from '../hooks/usePdfUpload';

const Dashboard = () => {
    const { upload, isLoading, error, result } = usePdfUpload();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">PDF Extraction Engine</h1>
            
            <FileUploader onUpload={upload} isLoading={isLoading} />
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{error}</p>
                </div>
            )}
            
            <ResultCard result={result} />
        </div>
    );
};

export default Dashboard;
