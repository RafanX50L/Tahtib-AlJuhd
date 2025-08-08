import React from "react";

interface LoadingProps {
  content: string;
}

const Loading: React.FC<LoadingProps> = ({ content }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white">{content}</p>
      </div>
    </div>
  );
};

export default Loading;
