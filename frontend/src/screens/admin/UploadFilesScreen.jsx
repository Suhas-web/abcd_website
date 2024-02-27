import { Table, Container } from "react-bootstrap";
import { useGetUserProfilesQuery } from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaFileUpload } from "react-icons/fa";
import FileUploader from "../../components/FileUploader";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";
import SearchBox from "../../components/SearchBox";

const UserListScreen = () => {
	const { pageNumber, keyword } = useParams();
	const { data, error, isLoading, refetch } = useGetUserProfilesQuery({
		pageNumber,
		keyword,
	});
	const title = keyword ? `Search results for ${keyword.trim()}` : "Users";

	return (
		<div className="mt-3">
			<Container>
				<h1>Upload Training Plan</h1>
				{keyword && title}
				{isLoading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">
						{error?.data?.message || error.error}
					</Message>
				) : (
					<>
						<SearchBox url="/admin/uploadFiles" />
						<Table striped hover responsive className="table-sm">
							<thead>
								<tr>
									<th>UserId</th>
									<th>Name</th>
									<th>Plan</th>
									<th>
										<FaFileUpload></FaFileUpload>Select PDF file
									</th>
								</tr>
							</thead>
							<tbody>
								{data && data.users && data.users.length > 0 ? (
									data.users
										.filter((user) => !user.isAdmin)
										.map((user) => (
											<tr key={user._id}>
												<td>{user._id}</td>
												<td>{user.name}</td>
												<td>{user.membershipPlan}</td>
												<td>
													<FileUploader userName={user._id} />
												</td>
											</tr>
										))
								) : (
									<h2>Not Found</h2>
								)}
							</tbody>
						</Table>
						<Paginate
							pages={data.pages}
							page={data.page}
							keyword={keyword}
							url="uploadFiles"
						/>
					</>
				)}
			</Container>
		</div>
	);
};

export default UserListScreen;
