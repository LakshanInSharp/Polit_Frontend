'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UploadResponse {
  success: boolean
  message: string
  fileName?: string
  fileSize?: number
  vectorCount?: number
  processingTime?: number
}

export default function UploadPDF() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [response, setResponse] = useState<UploadResponse | null>(null)
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      if (droppedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setResponse({
          success: false,
          message: 'File size exceeds 10MB limit. Please choose a smaller file.'
        })
        setShowModal(true)
        return
      }
      setFile(droppedFile)
    } else {
      setResponse({
        success: false,
        message: 'Please upload a PDF file.'
      })
      setShowModal(true)
    }
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === 'application/pdf') {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        setResponse({
          success: false,
          message: 'File size exceeds 10MB limit. Please choose a smaller file.'
        })
        setShowModal(true)
        return
      }
      setFile(selectedFile)
    } else {
      setResponse({
        success: false,
        message: 'Please upload a PDF file.'
      })
      setShowModal(true)
    }
  }, [])

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    setUploadProgress(0)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'http://localhost:8000/upload-pdf')

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          setUploadProgress(Math.round(progress))
        }
      }

      const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            } catch (error) {
              reject(new Error('Invalid response format'))
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error('Network error occurred'))
        xhr.send(formData)
      })

      const data = await uploadPromise
      setResponse({
        success: true,
        message: data.message || 'PDF uploaded and vectorized successfully!',
        fileName: file.name,
        fileSize: file.size,
        vectorCount: data.vectorCount,
        processingTime: data.processingTime
      })
    } catch (error) {
      setResponse({
        success: false,
        message: error instanceof Error ? error.message : 'Error uploading file. Please try again.'
      })
    } finally {
      setIsLoading(false)
      setShowModal(true)
      setFile(null)
      setUploadProgress(0)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setResponse(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload PDF</h1>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your PDF file here or click to select
          </p>
        </div>

        <div
          className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center transition-all duration-200 ${
            isDragging
              ? 'border-green-500 bg-green-50 scale-105'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileInput}
                  disabled={isLoading}
                />
                <div className={`px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                  isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                  Select PDF file
                </div>
              </label>
            </div>

            {file && !isLoading && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Selected file: {file.name}</p>
                <p className="text-xs text-gray-500">Size: {(file.size / (1024 * 1024)).toFixed(2)}MB</p>
                <button
                  onClick={handleUpload}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  Upload PDF
                </button>
              </div>
            )}

            {isLoading && (
              <div className="mt-4">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div 
                    className="absolute inset-0 border-4 border-green-600 rounded-full animate-spin"
                    style={{ 
                      clipPath: `polygon(50% 0%, 50% 50%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                      transform: `rotate(${uploadProgress * 3.6}deg)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">Uploading and vectorizing PDF...</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions:</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>Only PDF files are accepted</li>
            <li>Maximum file size: 10MB</li>
            <li>Make sure your PDF is readable and not password protected</li>
          </ul>
        </div>
      </div>

      {/* Enhanced Response Modal */}
      {showModal && response && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
            <div className="text-center">
              {response.success ? (
                <div className="mb-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Successful</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{response.message}</p>
                    {response.fileName && <p>File: {response.fileName}</p>}
                    {response.fileSize && <p>Size: {(response.fileSize / (1024 * 1024)).toFixed(2)}MB</p>}
                    {response.vectorCount && <p>Vectors created: {response.vectorCount}</p>}
                    {response.processingTime && <p>Processing time: {response.processingTime}s</p>}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Failed</h3>
                  <p className="text-sm text-gray-600">{response.message}</p>
                </div>
              )}
              <button
                onClick={closeModal}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 