import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ProfilePictureUpload = ({ photoUrl, setPhotoUrl }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BASE_URL}/uploadImage`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      setPhotoUrl(res.data.url);
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center mb-4">
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-slate-300 dark:border-slate-600">
          {isUploading ? (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              Uploading...
            </div>
          ) : (
            <img
              alt="Profile"
              src={photoUrl || "/default-profile.png"}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </label>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default ProfilePictureUpload;
