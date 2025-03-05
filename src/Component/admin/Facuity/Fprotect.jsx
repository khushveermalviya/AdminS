import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';

const Fprotect = ({ children, expectedRole }) => {
  const token = localStorage.getItem('tokenss'); // Check if token exists
  const location = useLocation();
  const [isValid, setIsValid] = useState(null); // State to track token validity
  const [isVerified, setIsVerified] = useState(false); // State to track if token has been verified
  const from = location.pathname;

  useEffect(() => {
    // Function to verify the token with the server
    const verifyTokenWithServer = async () => {
      if (!token) {
        // console.log('No token found in localStorage');
        setIsValid(false); // No token means invalid
        return;
      }

      try {
        // Decode the token to check the role
        const decodedToken = jwtDecode(token);
        // console.log('Decoded token:', decodedToken);

        if (decodedToken.role !== "faculty") {
        //   console.log('Role does not match expected role');
          localStorage.removeItem('tokenss');
          toast.error('You do not have access to this page. You will be redirected to the login page.', {
            autoClose: 5000,
          });
          setIsValid(false);
          return;
        }

        // console.log('Sending token to server for verification:', token);
        const response = await fetch('http://localhost:5000/api/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        // console.log('Server response:', data);

        if (response.ok && data.valid) {
        //   console.log('Token is valid and role matches');
          setIsValid(true); // Token is valid and role matches
        } else {
        //   console.log('Token is invalid, expired, or role does not match');
          // Clear the invalid token
          localStorage.removeItem('tokenss');
          toast.error('Your session has expired or you do not have access. You will be redirected to the login page.', {
            autoClose: 5000,
          });
          setIsValid(false); // Token is invalid, expired, or role does not match
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsValid(false); // Treat network errors as invalid tokens
      } finally {
        setIsVerified(true); // Mark token as verified
      }
    };

    if (!isVerified) {
      verifyTokenWithServer();
    }
  }, [token, isVerified, expectedRole]);

  // While waiting for the server response, show a loading state
  if (isValid === null) {
    return <div>Loading...</div>;
  }

  // If no valid token and trying to access protected routes, show toast and redirect after 5 seconds
  if (!isValid && location.pathname !== '/') {
    setTimeout(() => {
      window.location.href = '/';
    }, 5000);
    return (
      <>
        <ToastContainer />
        <div>Redirecting to login page...</div>
      </>
    );
  }

  // If we're on the root path and have a valid token, redirect to admin portal
  if (location.pathname === '/FacilityAuth' && isValid) {
    return <Navigate to="/Facility" replace state={{ from }} />;
  }

  // If we have a valid token and trying to access protected routes, allow access
  if (isValid && location.pathname.startsWith('/Facility')) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  // For the root path without a token, show the login page (Main component)
  if (location.pathname === '/' && !isValid) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  // Default fallback - redirect to root
  return (
    <>
      <Navigate to="/FacilityAuth" replace state={{ from }} />
      <ToastContainer />
    </>
  );
};

export default Fprotect;