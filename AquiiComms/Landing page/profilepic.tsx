import { useState, useRef } from 'react';
import './Dashboard.css'
const ProfilePicUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = JSON.parse(localStorage.getItem('userInfo') || "{}");
  // A guaranteed safe fallback URL
  const fallbackAvatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

  const handleIconClick = () => {
    fileInputRef.current?.click(); 
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5242880) {
        alert("Image is too large! Please select a file smaller than 5MB.");
        return; 
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('avatar', selectedFile); 
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/auth/profile/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user ? user.token : ''}` },
        body: formData,
      });

      const data = await response.json();
      if (data.avatarUrl) {
        user.avatar = data.avatarUrl;
        localStorage.setItem('userInfo', JSON.stringify(user));
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="profile-upload-wrapper">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />

      <div className="avatar-container">
        <img 
          src={previewUrl || user?.avatar || fallbackAvatar} 
          alt="Profile"
          className="avatar-image"
          // THE FIX: If Cloudinary throws a 401, this instantly intercepts the error and forces the fallback!
          onError={(e) => { e.currentTarget.src = fallbackAvatar; }} 
        />
        
        <button onClick={handleIconClick} type="button" className="camera-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        </button>
      </div>
      
      {selectedFile && (
        <button onClick={handleUpload} className="save-avatar-btn">Save Avatar</button>
      )}
    </div>
  );
};

export default ProfilePicUpload;