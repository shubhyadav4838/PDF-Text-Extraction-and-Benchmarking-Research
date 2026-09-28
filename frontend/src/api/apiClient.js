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

export const benchmarkPdf = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/v1/benchmark`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        let errorMessage = 'Failed to benchmark PDF';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
            errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};
