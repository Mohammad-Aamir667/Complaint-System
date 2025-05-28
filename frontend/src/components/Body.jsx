import { BASE_URL } from '@/utils/constants';
import { addUser } from '@/utils/userSlice';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'

const Body = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store?.user);

  const fetchUser = async ()=>{
      
    try{   
      const res = await axios.get(BASE_URL+"/user/profile",{
       withCredentials:true,
      });
    dispatch(addUser(res.data));
    
       }
       catch (err) {
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
    if (!user) fetchUser();
    else setLoading(false); 
  }, []);

  if (loading)  return  ( <div className="text-center py-8 flex flex-col items-center">
  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  <p className="mt-3 text-gray-300 font-medium">Loading...</p>
</div>
)
  return (
    <div>
        <Outlet />
    </div>
  )
}

export default Body