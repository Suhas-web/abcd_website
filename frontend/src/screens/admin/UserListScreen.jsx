import { Button, Table, Container } from "react-bootstrap";
import {
	useGetUserProfilesQuery,
	useDeleteProfileMutation,
} from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaCheck, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import SearchBox from "../../components/SearchBox";
import { useParams, Link } from "react-router-dom";
import Paginate from "../../components/Paginate";

const UserListScreen = () => {
	const { pageNumber, keyword } = useParams();
	const { data, error, isLoading, refetch } = useGetUserProfilesQuery({
		pageNumber,
		keyword,
	});
	const title = keyword ? `Search results for ${keyword.trim()}` : "Users";
	const [deleteUser, { isLoading: loadingDelete }] = useDeleteProfileMutation();
	const deleteUserHandler = async (id) => {
		if (window.confirm("Are you sure?")) {
			try {
				await deleteUser(id);
				toast.success("Deleted user successfully");
				refetch();
			} catch (err) {
				console.log(err);
				toast.error(err?.data?.message || err?.error);
			}
		}
	};

	return (
		<div className="mt-3">
			<Container>
				<h1>{title}</h1>
				<Link to="/admin/createUser">
					<Button variant="light" className="btn-sm">
						Add user
					</Button>
				</Link>
				<SearchBox url="/admin/userList" />
				{loadingDelete && <Loader />}
				{isLoading ? (
					<Loader />
				) : error ? (
					<Message variant="danger">
						{error?.data?.message || error.error}
					</Message>
				) : (
					<>
						<Table variant="dark" striped hover responsive className="table-sm">
							<thead>
								<tr>
									<th>UserId</th>
									<th>NAME</th>
									<th>Mobile Number</th>
									<th>Email</th>
									<th>Active Plan</th>
									<th>Valid till</th>
									<th>isAdmin</th>
									<th>Edit Profile</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{data && data.users && data.users.length > 0 ? (
									data.users.map((user) => (
										<tr key={user._id}>
											<td>{user._id}</td>
											<td>{user.name}</td>
											<td>{user.mobile}</td>
											<td>{user.email}</td>
											<td>{user.membershipPlan}</td>
											<td>
												{user.validTill
													? new Date(user.validTill).toLocaleDateString("en-IN")
													: "Not found"}
											</td>
											<td>
												{user.isAdmin ? (
													<FaCheck color="green"></FaCheck>
												) : (
													<FaTimes color="red"></FaTimes>
												)}
											</td>
											<td>
												<LinkContainer to={`/admin/user/${user._id}/edit`}>
													<Button className="btn-sm mx-2" variant="light">
														<FaEdit />
													</Button>
												</LinkContainer>
											</td>
											<td>
												<Button
													className="btn-sm mx-2"
													variant="danger"
													onClick={() => deleteUserHandler(user._id)}
												>
													<FaTrash />
												</Button>
											</td>
										</tr>
									))
								) : (
									<h2>Not found</h2>
								)}
							</tbody>
						</Table>
						<Paginate
							pages={data.pages}
							page={data.page}
							keyword={keyword}
							url="userList"
						/>
					</>
				)}
			</Container>
		</div>
	);
};

export default UserListScreen;
