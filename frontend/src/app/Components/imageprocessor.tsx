"use client";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type ImageFile = {
  file: File;
  preview: string;
};

export default function ImageProcessor() {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage({
        file,
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    setProcessedImage(null);
    setError(null);
    setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const processImage = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("image", image.file, image.file.name); // Important: include filename

    try {
      const response = await axios.post(
        `${apiUrl}`, // Use the environment variable for the API URL
        formData,
        {
          responseType: "blob",
          headers: {
            "Content-Type": "multipart/form-data", // This is important
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );

      const processedUrl = URL.createObjectURL(response.data);
      setProcessedImage(processedUrl);
      setProgress(100);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error processing image");
      console.error("Processing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage || !downloadRef.current) return;

    downloadRef.current.href = processedImage;
    downloadRef.current.download = `no-bg-${
      image?.file.name.replace(/\.[^/.]+$/, "") || "image"
    }.png`;
    downloadRef.current.click();
  };

  const resetAll = () => {
    setImage(null);
    setProcessedImage(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Hidden download anchor */}
      <a ref={downloadRef} className="hidden" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Professional Background Remover
            </span>
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Upload an image to automatically remove the background with
            AI-powered technology
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Upload Zone */}
          {!image && (
            <div
              {...getRootProps()}
              className={`p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "bg-blue-50 border-blue-400"
                  : "bg-white hover:bg-gray-50 border-gray-200"
              } border-2 border-dashed rounded-lg`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-blue-100">
                  <ArrowUpTrayIcon className="h-8 w-8 text-blue-600" />
                </div>
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">
                    Drop the image here
                  </p>
                ) : (
                  <>
                    <div>
                      <p className="font-medium text-gray-900">
                        Drag & drop your image
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Supports: PNG, JPG, JPEG up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Preview Section */}
          {image && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Image Processing
                </h2>
                <button
                  onClick={resetAll}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <XMarkIcon className="h-4 w-4" /> Change image
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="h-80 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                    <Image
                      src={image.preview}
                      alt="Result"
                      width={500}
                      height={500}
                      className="object-contain max-h-full max-w-full"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Original
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-80 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                    {processedImage ? (
                      <>
                        <img
                          src={processedImage}
                          alt="Processed result"
                          className="object-contain max-h-full max-w-full"
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Result
                        </div>
                      </>
                    ) : (
                      <div
                        className={`text-center p-4 ${
                          isLoading ? "opacity-70" : ""
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="relative w-full max-w-xs h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                              <div
                                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <p className="text-gray-600">
                              {progress < 100 ? "Processing..." : "Finalizing"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {progress}% complete
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-3">
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <p>Background removed image will appear here</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                {!processedImage && !isLoading && (
                  <button
                    onClick={processImage}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    Remove Background
                  </button>
                )}

                {isLoading && (
                  <button
                    disabled
                    className="px-6 py-3 bg-blue-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Processing ({progress}%)
                  </button>
                )}

                {processedImage && (
                  <>
                    <button
                      onClick={downloadImage}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      Download PNG
                    </button>
                    <button
                      onClick={processImage}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                      Process Again
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mb-6 rounded">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by Next.js and AI background removal technology</p>
        </div>
      </div>
    </div>
  );
}
