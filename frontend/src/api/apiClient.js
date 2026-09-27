const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000';

export const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-pdf/`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload PDF');
    }

    return response.json();
};
