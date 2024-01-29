import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, keyword = "", url }) => {
	return (
		pages > 1 && (
			<Pagination className="justify-content-md-center">
				{[...Array(pages).keys()].map((x) => (
					<LinkContainer
						key={x + 1}
						to={
							keyword
								? `/admin/${url}/search/:keyword/page/${x + 1}`
								: `/admin/${url}/page/${x + 1}`
						}
					>
						<Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
					</LinkContainer>
				))}
			</Pagination>
		)
	);
};

export default Paginate;
