import { useState } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    setResult(null)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.")
      return
    }

    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('file', file) 

    try {
      const response = await fetch('http://localhost:8000/upload-pdf/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">PDF Text Extraction Tester</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
          />
          <button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-md font-medium text-white transition-colors
              ${!file || loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm'}`}
          >
            {loading ? "Processing..." : "Upload to Python"}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              Success! Data from Backend:
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">File Name</span>
                <span className="font-medium text-gray-900 break-all">{result.filename}</span>
              </div>
              <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
                <span className="block text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Total Pages</span>
                <span className="font-medium text-gray-900">{result.total_pages}</span>
              </div>
            </div>
            
            <h4 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">First Page Raw Text</h4>
            <div className="bg-white border border-gray-300 rounded-md overflow-hidden shadow-inner">
              <pre className="p-4 text-sm text-gray-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                {result.first_page_preview}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App