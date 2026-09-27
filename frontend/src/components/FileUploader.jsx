import React, { useState } from 'react';

const FileUploader = ({ onUpload, isLoading }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            onUpload(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow-sm bg-white">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pdf-upload">
                    Upload PDF Document
                </label>
                <input 
                    type="file" 
                    id="pdf-upload"
                    accept=".pdf" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>
            <button 
                type="submit" 
                disabled={!file || isLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition-colors"
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
};

export default FileUploader;
