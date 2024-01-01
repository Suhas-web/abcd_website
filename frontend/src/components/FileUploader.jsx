import React, { useState } from 'react';
import { useUploadPlanMutation } from '../slices/plansApiSlice'; 
import {toast} from 'react-toastify'
import { Spinner } from 'react-bootstrap';

function FileUploader({userName}) {
  const [uploadFile, { isLoading, data, error }] = useUploadPlanMutation();
  const [selectedFile, setSelectedFile] = useState();

  const handleFileChange = (e) => {
    const selectedFile = {
      data: e.target.files[0],
    };
    setSelectedFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if(!selectedFile){
      toast.error("Choose file to upload")
    } else {
      let formData = new FormData();
      formData.append("file", selectedFile.data);
      formData.append("userName", userName)
      const res = await uploadFile(formData);
      if(res && res.data && res.data.isError == false){
        toast.success("File uploaded to google drive")
      } else {
        toast.error("Error uploading files. Try again")
      }
      console.log(res);
    }
  };

  const handleErrorUpload = (error) => {
    console.log(error);
  }

  return (
    <div>
      {isLoading && <Spinner/>}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isLoading}>
        Upload
      </button>
    </div>
  );
}

export default FileUploader;