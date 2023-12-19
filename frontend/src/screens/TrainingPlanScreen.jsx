import React from 'react'
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdfFile from '../assets/training.pdf'
import { pdfjs } from 'react-pdf';
import { Container } from 'react-bootstrap';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

const TrainingPlanScreen = () => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  return (
    <Container>
      <h1 className='text-center mt-3 mb-0'>Training Plan</h1>
      <Document file={pdfFile} loading="Loading PDF..." noData="No pdf found" >
        <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false}/>
      </Document>
    </Container>
  )
}

export default TrainingPlanScreen