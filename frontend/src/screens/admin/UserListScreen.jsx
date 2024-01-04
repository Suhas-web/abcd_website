import {Button, Table, Container} from 'react-bootstrap';
import { useGetUserProfilesQuery, useDeleteProfileMutation} from '../../slices/usersApiSlice'
import Loader from '../../components/Loader' 
import Message from '../../components/Message' 
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap'
import {toast} from 'react-toastify'

const UserListScreen = () => {

    const {data: users, error, isLoading, refetch} = useGetUserProfilesQuery();
    const [deleteUser, {isLoading: loadingDelete}] = useDeleteProfileMutation();
    const deleteUserHandler = async (id) => {
      if(window.confirm("Are you sure?")){
        try {
          await deleteUser(id);
          toast.success("Deleted user successfully")
          refetch();
        } catch (err) {
          console.log(err);
          toast.error(err?.data?.message || err?.error);
        }
      }
    }
    
    return (
      <div className='mt-3'>
    <Container>
      <h1>Users</h1>
      {loadingDelete && <Loader/>}
    {isLoading ? <Loader/> : 
    error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : 
    <>
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr>
            <th>UserId</th>
            <th>NAME</th>
            <th>Mobile Number</th>
            <th>Active Plan</th>
            <th>isAdmin</th>
            <th>Edit Profile</th>
          </tr>
        </thead>
        <tbody>
         {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.mobile}</td>
              <td>{user.membershipPlan}</td>
              <td>{user.isAdmin ? <FaCheck color='green'></FaCheck> : <FaTimes color='red'></FaTimes>}</td>
              <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                  <Button className="btn-sm mx-2" variant="light"><FaEdit/></Button>
                </LinkContainer>
              </td>
              <td>
                <Button className="btn-sm mx-2" variant="danger" onClick={() => deleteUserHandler(user._id)}><FaTrash/></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>}
    </Container>
    </div>
    );
};

export default UserListScreen;
