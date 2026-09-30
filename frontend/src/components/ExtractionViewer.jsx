import React, { useState, useEffect } from 'react';

const ExtractionViewer = ({ file, extractionData, onBack }) => {
    const [selectedPage, setSelectedPage] = useState(1);
    const [fileBlobUrl, setFileBlobUrl] = useState('');

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setFileBlobUrl(url);
            
            return () => {
                URL.revokeObjectURL(url);
            };
        }
    }, [file]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).catch(err => console.error('Failed to copy text: ', err));
    };

    if (!extractionData) return null;

    const meta = extractionData.document_meta;
    const pages = extractionData.pages || [];
    
    // Fallback to first page if not found
    const currentPageData = pages.find(p => p.page_number === selectedPage) || pages[0];

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm h-[80px]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        &larr; Back to Dashboard
                    </button>
                    <div className="text-sm text-gray-600 hidden md:flex items-center">
                        <span className="font-bold text-gray-900">{meta.filename}</span>
                        <span className="mx-2">|</span>
                        <span>{meta.total_pages} Pages</span>
                        <span className="mx-2">|</span>
                        <span className="text-green-600 font-medium">Native: {meta.pages_native}</span>
                        <span className="mx-2">|</span>
                        <span className="text-purple-600 font-medium">OCR: {meta.pages_ocr}</span>
                        <span className="mx-2">|</span>
                        <span>{meta.total_latency_ms.toFixed(0)} ms</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">View Page:</label>
                    <select 
                        className="border border-gray-300 rounded-md p-2 text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(Number(e.target.value))}
                    >
                        {pages.map(p => (
                            <option key={p.page_number} value={p.page_number}>
                                Page {p.page_number}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
                
                {/* Left Pane: PDF Viewer */}
                <div className="flex flex-col bg-white border rounded-xl shadow-sm overflow-hidden h-full">
                    <div className="bg-gray-100 border-b px-4 py-2 font-semibold text-sm text-gray-700">Original Document</div>
                    <div className="flex-1 w-full bg-gray-50">
                        {fileBlobUrl && (
                            <iframe 
                                src={`${fileBlobUrl}#page=${selectedPage}`} 
                                className="w-full h-full border-none"
                                title="PDF Viewer"
                            />
                        )}
                    </div>
                </div>

                {/* Right Pane: Extracted Content */}
                <div className="flex flex-col bg-white border rounded-xl shadow-sm overflow-hidden h-full">
                    <div className="bg-gray-100 border-b px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            {currentPageData?.routing_decision === "NATIVE" ? (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded border border-green-200 font-bold tracking-wider">
                                    [DIGITAL NATIVE - PyMuPDF]
                                </span>
                            ) : (
                                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded border border-purple-200 font-bold tracking-wider">
                                    [SCANNED PAGE - Tesseract OCR]
                                </span>
                            )}
                            <div className="text-xs text-gray-600 font-medium">
                                Words: {currentPageData?.metrics?.word_count || 0}
                            </div>
                            <div className="text-xs text-gray-600 font-medium">
                                Img Cov: {currentPageData?.metrics?.image_coverage_pct?.toFixed(1) || '0.0'}%
                            </div>
                        </div>
                        <button 
                            onClick={() => handleCopy(currentPageData?.extracted_text || '')}
                            className="text-xs px-3 py-1 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            Copy Text
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-auto p-4 bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed">
                        <pre className="whitespace-pre-wrap">{currentPageData?.extracted_text || 'No text extracted.'}</pre>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default ExtractionViewer;
