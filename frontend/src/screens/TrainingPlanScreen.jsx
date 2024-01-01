import React from 'react'
import { useState,useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { useDownloadPlanMutation } from '../slices/plansApiSlice';
import { useSelector } from 'react-redux';
import classicPlan from '../assets/classicPlan.pdf'
import { Container } from 'react-bootstrap';
import Loader from '../components/Loader'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();

const TrainingPlanScreen = () => {
const {userInfo} = useSelector(state => state.auth)
const [file, setFile] = useState(null);
const [getFile, {isLoading}] = useDownloadPlanMutation();

  useEffect(() => {
    if(userInfo && userInfo.membershipPlan && userInfo.membershipPlan === "PREMIUM"){
      const getDownloadedFile = async () => {
      const pdfData = await getFile(userInfo._id);
      console.log("pdfData", pdfData)
      if(pdfData && !isLoading && pdfData.data){
        const buffer = await pdfData.data.buffer;
        const unit8 = new Uint8Array(buffer);
        setFile({ data: unit8});
        console.log("file", file);
        }
      }
      getDownloadedFile();       
    }
    if(userInfo && (userInfo.membershipPlan === "CLASSIC" || userInfo.membershipPlan === "PREMIUM") && !file){
      setFile(classicPlan);
    }
  }, [getFile, userInfo]);
  
  return (
      ((userInfo.membershipPlan === "CLASSIC" || userInfo.membershipPlan === "PREMIUM") && file) ? (isLoading ? <Loader/> : <Container>
      <h2 className='mt-2 mr-2 mb-0'>Active Plan: {userInfo.membershipPlan}</h2>
      <Document file={file}>
        <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false}/>
      </Document>
      </Container>) :
      <Container className='mt-3'>
       <h2>You need to have an active gym membership to get training plan</h2>
       <h3>Already have a active membership? Contact the admin to register your membership plan</h3>
      </Container>
      )
}

export default TrainingPlanScreen