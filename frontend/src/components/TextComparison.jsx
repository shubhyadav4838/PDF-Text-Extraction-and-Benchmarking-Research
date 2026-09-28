import React from 'react';

const TextComparison = ({ texts }) => {
    if (!texts || texts.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {texts.map((item, index) => (
                <div 
                    key={index} 
                    className="flex flex-col bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden h-[600px]"
                >
                    <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800 text-lg">{item.engine_id}</h3>
                    </div>
                    <div className="p-4 flex-grow overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                            {item.extracted_text || 'No text extracted.'}
                        </pre>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TextComparison;
