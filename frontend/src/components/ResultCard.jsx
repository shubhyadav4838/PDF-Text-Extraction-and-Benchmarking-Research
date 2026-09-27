import React from 'react';

const ResultCard = ({ result }) => {
    if (!result) return null;

    const { data } = result;

    return (
        <div className="p-4 border rounded shadow-sm bg-white mt-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Extraction Result</h2>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Metadata:</h3>
                <ul className="list-disc list-inside text-gray-600">
                    <li><strong>Filename:</strong> {data?.filename}</li>
                    <li><strong>Pages:</strong> {data?.metadata?.pages}</li>
                    <li><strong>Size:</strong> {data?.metadata?.size} bytes</li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700">Extracted Text:</h3>
                <div className="bg-gray-50 border p-3 rounded mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm text-gray-800">
                    {data?.text || "No text extracted."}
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
