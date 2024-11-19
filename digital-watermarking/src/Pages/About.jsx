import React from 'react'

const About = () => {
    return (
        <div>
            <div className="relative w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">label</h2>
                <label
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                    <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                        <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">Supported: SVG, PNG, JPG, GIF</p>
                    </div>
                    <input

                        type="file"
                        className="hidden"
                        accept="image/*"

                    />
                </label>

                <div className="absolute top-2 right-2 w-16 h-16 border border-gray-300 rounded overflow-hidden">

                </div>

                <button
                    type="button"
                    className="mt-4 w-full text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-200"
                >
                    Upload Image
                </button>
            </div>
        </div>
    )
}

export default About