import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user?.role === "employee") {
      navigate('/employee/dashboard');
    } else if (user?.role === "manager") {
      navigate('/manager/dashboard');
    } else if (user?.role === "admin") {
      navigate('/admin/dashboard');
    } else if (user?.role === "super-admin") {
      navigate('/super-admin/dashboard');
    }
  }, [user, navigate]);
  

  useEffect(() => {
    if (!password.startsWith(confirmPassword)) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }
  }, [password, confirmPassword]);

  const handleLogin = async () => {
    if (!emailId && !password) {
      setError("Email and password are required");
      return;
    } else if (!emailId) {
      setError("Email is required");
      return;
    } else if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password,
      }, { withCredentials: true });

      dispatch(addUser(res.data));
      console.log(res.data);
      if(res?.data) {
        navigate(`/${res.data?.role}/dashboard`);
      }
      else
      navigate("/");
    } catch (err) {
      console.log(err);
      //if (err?.response?.status === 401 || err?.response?.status === 400) 
      {
        setError(err?.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !emailId || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(BASE_URL + "/signup", {
        firstName: firstName.trim(),
        lastName,
        emailId: emailId.trim(),
        password,
      }, { withCredentials: true });

      dispatch(addUser(res.data));
      navigate("/profile");
    } catch (err) {
      console.log(err);
      if (err?.response?.status === 401 || err?.response?.status === 400) {
        setError(err?.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${!isLoginForm ? "mt-9" : "mt-0"} flex justify-center items-center min-h-screen bg-gray-900 p-4`}>
      <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">{isLoginForm ? "Login" : "Sign Up"}</h2>

        {!isLoginForm && (
          <>
            <div className="mb-4">
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter Your First Name"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Your Last Name"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1">Email ID</label>
          <input
            type="text"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>

        {!isLoginForm && (
          <div className="mb-4">
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        )}

        {passwordMatchError && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}

        <button
          onClick={isLoginForm ? handleLogin : handleSignUp}
          className="w-full py-2 mt-6 rounded bg-orange-600 hover:bg-orange-700 transition disabled:opacity-50"
          disabled={loading || (!isLoginForm && passwordMatchError)}
        >
          {loading ? "Processing..." : isLoginForm ? "Login" : "Sign Up"}
        </button>

        {isLoginForm && (
          <div className="text-center mt-4">
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-blue-400 cursor-pointer hover:underline text-sm"
            >
              Forgot Password?
            </p>
          </div>
        )}

        <div className="text-center mt-4">
          <p
            onClick={() => setIsLoginForm((prev) => !prev)}
            className="cursor-pointer text-sm text-gray-300 hover:underline"
          >
            {isLoginForm ? "Don't have an account? Sign up here." : "Already have an account? Log in here."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
