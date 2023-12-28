import React from 'react'
import { useState,useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { useDownloadPlanMutation } from '../slices/plansApiSlice';
import { useSelector } from 'react-redux';
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const TrainingPlanScreen = () => {
const {userInfo} = useSelector(state => state.auth)
const [file, setFile] = useState(null);
const [getFile] = useDownloadPlanMutation();

  useEffect(() => {
    const getDownloadedFile = async () => {
    const pdfData = await getFile(userInfo._id);
  console.log("pdfData", pdfData)
  console.log("typeof pdfData", typeof pdfData)
  const buffer = await pdfData.data.buffer;
  setFile(new Uint8Array(buffer));
  console.log("file", file);
  }
  getDownloadedFile(); 
  }, [userInfo]);
  
  if (file) {
    return (
      <Document file={{ data: file }}>
        <Page pageNumber={1} />
      </Document>
    );
  } else {
    return <div>Loading...</div>;
  }
}



export default TrainingPlanScreen