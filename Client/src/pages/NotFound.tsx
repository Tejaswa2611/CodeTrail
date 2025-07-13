import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Logo404 } from "../components/LogoVariants";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-tech-dark">
      <div className="text-center max-w-md mx-auto px-6">
        <Logo404 />
        
        <div className="mt-8 space-y-4">
          <div className="text-tech-gray font-mono text-sm">
            <span className="text-tech-accent-green">{'>'}</span> Error Code: 404
            <br />
            <span className="text-tech-accent-green">{'>'}</span> Route: {location.pathname}
            <br />
            <span className="text-tech-accent-green">{'>'}</span> Status: Resource not found
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="block w-full px-6 py-3 bg-tech-primary-green text-black font-mono font-semibold rounded-lg hover:bg-tech-accent-green transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-tech-primary-green/25"
            >
              {'>'} Return to Dashboard
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="block w-full px-6 py-3 border border-tech-primary-green text-tech-primary-green font-mono font-medium rounded-lg hover:bg-tech-primary-green hover:text-black transition-all duration-300"
            >
              {'<'} Go Back
            </button>
          </div>
          
          <div className="mt-6 text-xs text-tech-gray font-mono opacity-60">
            <p>{'{'} "message": "The matrix has no record of this location" {'}'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
