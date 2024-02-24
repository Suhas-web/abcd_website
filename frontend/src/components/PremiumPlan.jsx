import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { useDownloadPlanMutation } from "../slices/plansApiSlice";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Loader from "../components/Loader";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PremiumPlan = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [pdfUrl, setPdfUrl] = useState(null);
	const [getFile, { isLoading }] = useDownloadPlanMutation();

	useEffect(() => {
		const getDownloadedFile = async () => {
			try {
				const pdfData = await getFile(userInfo._id);
				console.log("pdfData", pdfData);
				if (pdfData && pdfData.data) {
					setPdfUrl(pdfData.data);
				}
			} catch (error) {
				console.error("Error downloading PDF:", error);
			}
		};
		getDownloadedFile();
	}, [getFile, userInfo]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				pdfUrl && (
					<Container>
						<h4>Latest Training Plan</h4>
						<Document file={pdfUrl}>
							<Page
								pageNumber={1}
								renderTextLayer={false}
								renderAnnotationLayer={false}
							/>
						</Document>
					</Container>
				)
			)}
		</>
	);
};

export default PremiumPlan;
