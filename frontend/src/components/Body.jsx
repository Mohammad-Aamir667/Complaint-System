import { BASE_URL } from '@/utils/constants';
import { addUser } from '@/utils/userSlice';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'

const Body = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store?.user);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "/user/profile", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
      } else {
        console.log("Fetch user error", err);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-3 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }


  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Body