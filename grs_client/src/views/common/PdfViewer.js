// PdfViewer.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PdfViewer = () => {
    const { filename } = useParams();
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        // Fetch the PDF URL based on the filename
        const fetchPdfUrl = async () => {
            try {
                //authroutes
                const response = await fetch(`http://localhost:3002/api/v1/authroutes/getgrievanceUploadedPdf/${filename}`);
                //const response = await CustomGetApi(`http://localhost:3002/api/v1/caraemployee/getgrievanceUploadedPdf/${filename}`);
                console.log("response", response);
                //const response = await fetch(`${process.env.grievanceBaseURL}/caringsStakeholders/getgrievanceUploadedPdf/${filename}`);
                const pdfData = await response.blob();
                const pdfUrl = URL.createObjectURL(pdfData);
                setPdfUrl(pdfUrl);
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };

        fetchPdfUrl();

        // Cleanup when the component is unmounted
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [filename]);

    if (!pdfUrl) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ height: '100vh' }}>
            <embed src={pdfUrl} type="application/pdf" width="100%" height="100%" />
        </div>
    );
};

export default PdfViewer;
