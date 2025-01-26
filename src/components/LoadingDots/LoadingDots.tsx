import React from "react";

const LoadingDots = () => {
    return (
        <div className="flex justify-start items-center space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></div>
        </div>
    )
};

export default LoadingDots;