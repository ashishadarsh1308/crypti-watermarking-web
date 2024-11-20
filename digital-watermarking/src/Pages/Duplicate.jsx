import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios"; // To interact with your Python API
import Header from "../components/Header";
import firebaseApp from "../Firebase";

const Duplicate = () => {
    const [image, setImage] = useState(null);
    const [notification, setNotification] = useState({ message: "", type: "" });
    const [generatedImages, setGeneratedImages] = useState({ masterShare: "", ownerShare: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(""); // For original image preview
    const [uploadProgress, setUploadProgress] = useState(0);


    const storage = getStorage(firebaseApp);

    const validateFile = (file) => {
        const maxFileSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (file.size > maxFileSize) {
            setNotification({ message: "File size exceeds 5MB", type: "error" });
            return false;
        }
        if (!allowedTypes.includes(file.type)) {
            setNotification({ message: "Unsupported file type. Use PNG or JPEG", type: "error" });
            return false;
        }
        return true;
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (validateFile(file)) {
            if (type === "original") {
                setImage(file);
                setImagePreview(URL.createObjectURL(file)); // Create preview URL
            }
        }
    };

    const uploadImage = async (file, path) => {
        setUploading(true);
        setUploadProgress(0); // Reset progress before uploading
        try {
            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, file, {
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round((progressEvent.bytesTransferred / progressEvent.totalBytes) * 100);
                    setUploadProgress(percentage);
                }
            });
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error(`Error uploading image to ${path}:`, error);
            return null;
        } finally {
            setUploading(false);
        }
    };


    const uploadOriginalImage = async () => {
        if (!image) {
            setNotification({ message: "No original image selected", type: "error" });
            return;
        }
        const url = await uploadImage(image, `images/original/${image.name}`);
        if (url) {
            setNotification({ message: "Original image uploaded successfully!", type: "success" });
        } else {
            setNotification({ message: "Error uploading original image", type: "error" });
        }
    };

    const generateShares = async () => {
        try {
            if (!image) {
                setNotification({ message: "images need to be uploaded first", type: "error" });
                return;
            }

            setIsLoading(true);

            const originalRef = ref(storage, `images/original/${image.name}`);
            const originalUrl = await getDownloadURL(originalRef);
            const response = await axios.post("http://localhost:5000/stolen_watermark", {
                originalImage: originalUrl,
            });

            const { master_image } = response.data;
            setGeneratedImages({
                masterShare: `data:image/png;base64,${master_image}`,
            });

            setNotification({ message: "Shares generated successfully!", type: "success" });
        } catch (error) {
            console.error("Error generating shares:", error);
            setNotification({ message: "Error generating shares", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ message: "", type: "" });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <div>
            <Header />
            {notification.message && (
                <div
                    className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {notification.message}
                </div>
            )}
            <div className="flex flex-col items-center justify-center p-8 pt-24 bg-gray-100 min-h-screen">
                <div className="">
                    {/* Original Image Upload */}
                    <div className="relative w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Upload Stolen Image</h2>
                        <label
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
                        >
                            <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                                <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400">Supported: PNG, JPG, JPEG</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "original")}
                            />
                        </label>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Original Preview"
                                className="mt-4 w-full h-32 object-contain border border-gray-300 rounded"
                            />
                        )}
                        <button
                            type="button"
                            onClick={uploadOriginalImage}
                            className="mt-4 w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200"
                        >
                            Upload Image
                        </button>
                        {uploading && (
                            <div className="mt-4 w-full max-w-md">
                                <p className="text-center text-gray-500">Uploading... {uploadProgress}%</p>
                                <div className="w-full h-2 bg-gray-300 rounded-full">
                                    <div
                                        className="h-full bg-blue-600 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Generate Shares Button */}
                <button
                    onClick={generateShares}
                    disabled={isLoading}
                    className="mt-8 w-80 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200"
                >
                    {isLoading ? "Generating..." : "Generate Master Share"}
                </button>

                {/* Download Links for Generated Images */}
                <div className="mt-4 gap-6">
                    {generatedImages.masterShare && (
                        <a
                            className="mr-8 mt-8 w-full text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200"
                            href={generatedImages.masterShare} download="master_share.png">
                            Download Master Share
                        </a>
                    )}

                </div>
            </div>

        </div>
    );
};

export default Duplicate;
