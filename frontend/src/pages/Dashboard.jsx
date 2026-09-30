import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import ResultCard from '../components/ResultCard';
import { usePdfUpload } from '../hooks/usePdfUpload';
import { useBenchmark } from '../hooks/useBenchmark';
import { useExtraction } from '../hooks/useExtraction';
import BenchmarkTable from '../components/BenchmarkTable';
import TextComparison from '../components/TextComparison';
import ExtractionViewer from '../components/ExtractionViewer';

const Dashboard = () => {
    const { upload, isLoading: isUploadLoading, error: uploadError, result } = usePdfUpload();
    const { runBenchmark, data: benchmarkData, isLoading: isBenchmarkLoading, error: benchmarkError } = useBenchmark();
    const { executeExtraction, data: extractionData, isLoading: isExtractionLoading, error: extractionError, reset: resetExtraction } = useExtraction();
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [showExtractionView, setShowExtractionView] = useState(false);

    const handleUpload = (file) => {
        setSelectedFile(file);
        upload(file);
    };

    const handleExtract = async () => {
        if (selectedFile) {
            await executeExtraction(selectedFile);
            setShowExtractionView(true);
        }
    };

    const handleBackFromExtraction = () => {
        setShowExtractionView(false);
        resetExtraction();
    };

    if (showExtractionView && extractionData) {
        return (
            <ExtractionViewer 
                file={selectedFile} 
                extractionData={extractionData} 
                onBack={handleBackFromExtraction} 
            />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">PDF Extraction Engine</h1>
            
            <FileUploader onUpload={handleUpload} isLoading={isUploadLoading} />
            
            {(uploadError || extractionError) && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{uploadError || extractionError}</p>
                </div>
            )}
            
            <ResultCard result={result} />

            <div className="my-8 flex justify-center gap-4">
                <button
                    onClick={() => runBenchmark(selectedFile)}
                    disabled={!selectedFile || isBenchmarkLoading || isExtractionLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg flex-1 max-w-[250px]"
                >
                    {isBenchmarkLoading ? 'Running...' : 'Run Benchmark'}
                </button>
                <button
                    onClick={handleExtract}
                    disabled={!selectedFile || isBenchmarkLoading || isExtractionLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg flex-1 max-w-[250px]"
                >
                    {isExtractionLoading ? 'Extracting...' : 'Extract Data'}
                </button>
            </div>

            {(isBenchmarkLoading || isExtractionLoading) && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            {benchmarkError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200 text-center mb-8">
                    {benchmarkError}
                </div>
            )}

            {!isBenchmarkLoading && benchmarkData && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Benchmark Results</h2>
                    <BenchmarkTable metrics={benchmarkData.summary_metrics} />
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Text Comparison</h3>
                    <TextComparison texts={benchmarkData.text_comparison} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
