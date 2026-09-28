import React from 'react';

const BenchmarkTable = ({ metrics }) => {
    if (!metrics || metrics.length === 0) {
        return null;
    }

    return (
        <div className="overflow-x-auto w-full mb-8 rounded-lg shadow-md border border-gray-200">
            <table className="w-full text-sm text-left text-gray-700 bg-white">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900">Engine Name</th>
                        <th className="px-6 py-3 font-semibold text-gray-900">Latency (ms)</th>
                        <th className="px-6 py-3 font-semibold text-gray-900">Total Words</th>
                        <th className="px-6 py-3 font-semibold text-gray-900">Total Characters</th>
                        <th className="px-6 py-3 font-semibold text-gray-900">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {metrics.map((metric, index) => {
                        const isError = metric.status === 'error';
                        return (
                            <tr
                                key={index}
                                className={`hover:bg-gray-50 transition-colors ${
                                    isError ? 'bg-red-50 text-red-700' : ''
                                }`}
                            >
                                <td className={`px-6 py-4 font-medium ${isError ? 'text-red-900' : 'text-gray-900'}`}>
                                    {metric.engine_name || metric.engine_id}
                                </td>
                                <td className="px-6 py-4">{metric.latency_ms != null ? metric.latency_ms.toFixed(2) : '-'}</td>
                                <td className="px-6 py-4">{metric.total_words ?? '-'}</td>
                                <td className="px-6 py-4">{metric.total_characters ?? '-'}</td>
                                <td className="px-6 py-4 capitalize font-medium">{metric.status}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BenchmarkTable;
