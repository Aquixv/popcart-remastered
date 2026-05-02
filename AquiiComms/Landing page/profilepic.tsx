import { useState, useRef } from 'react';
import type { UserInfo } from './types';

const user = JSON.parse(localStorage.getItem('userInfo') || "{}");
const ProfilePicUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

const handleIconClick = () => {
  fileInputRef.current?.click(); 
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('avatar', selectedFile); 
    console.log("1. Selected File in State:", selectedFile);
    for (let [key, value] of formData.entries()) {
      console.log(`2. Inside FormData -> ${key}:`, value);
    }
    try {
      const savedUser = JSON.parse(localStorage.getItem('userInfo') || "{}");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/profile/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${savedUser ? savedUser.token : ''}` 
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Success:", data);

      if (data.avatarUrl) {
        savedUser.avatar = data.avatarUrl;
        localStorage.setItem('userInfo', JSON.stringify(savedUser));
        window.location.reload(); 
      }

    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*"
      />

      <div style={{ position: 'relative', width: '150px', height: '150px' }}>
        
        <img 
  src={user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
  alt="Profile"
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '50%', 
            objectFit: 'cover',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }} 
        />

        <button 
          onClick={handleIconClick} 
          type="button"
          style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            backgroundColor: '#2d3748',
            border: '3px solid white',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <img 
            src="https://www.svgrepo.com/show/522016/camera.svg" 
            alt="cam" 
            style={{ width: '24px', height: '24px', filter: 'invert(1)' }} 
          />
        </button>
      </div>
      {selectedFile && (
        <button 
          onClick={handleUpload}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Save
        </button>
      )}
    </div>
  );
};
  export default ProfilePicUpload;