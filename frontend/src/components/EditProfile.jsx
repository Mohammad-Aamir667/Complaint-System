import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addUser } from '@/utils/userSlice';
import { BASE_URL } from '@/utils/constants';
import ProfilePictureUpload from './ProfilePictureUpload';

const EditProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState(false);
  console.log(gender)

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    try {
      setError("");
      setApiError(false);

      const res = await axios.post(
        `${BASE_URL}/editProfile`,
        { firstName, lastName, gender, photoUrl },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      navigate(-1); // Go back to the previous page or a dashboard
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 400) {
        setError(err.response.data.message || "Invalid input");
      } else {
        setApiError(true);
      }
    }
    useEffect(() => {
        if (user) {
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setGender(user.gender || "");
          setPhotoUrl(user.photoUrl || "");
        }
      }, [user]);
      
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-100">Edit Profile</h2>
      
      <ProfilePictureUpload photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} />

      <form onSubmit={handleSaveProfile} className="space-y-4 mt-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {apiError && <p className="text-red-500 text-sm">Something went wrong. Please try again later.</p>}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Gender</label>
          <select
            value={gender.trim()}
            onChange={(e) => setGender(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
