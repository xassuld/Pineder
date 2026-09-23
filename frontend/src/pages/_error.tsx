import { NextPageContext } from "next";
import { useEffect } from "react";

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function Error({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  useEffect(() => {
    if (!hasGetInitialPropsRun && err) {
      console.error("Error occurred:", err);
    }
  }, [hasGetInitialPropsRun, err]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          {statusCode || "Error"}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {statusCode
            ? `A ${statusCode} error occurred on server`
            : "An error occurred on client"}
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, hasGetInitialPropsRun: true, err };
};

export default Error;
