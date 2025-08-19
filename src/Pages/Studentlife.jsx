import React from 'react';

const StudentEvent = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-60 h-32 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mb-4">
                        <p>Student Event</p>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Page Not Found For Now</h1>
                    <p className="text-gray-600 text-center">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                        onClick={() => window.history.back()}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentEvent;