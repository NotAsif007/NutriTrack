import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { HelpCircle } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F9F7] flex flex-col justify-center items-center p-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-gray-900">404 — Page Not Found</h1>
      <p className="text-sm text-gray-500 mt-2 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="md">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
