import {Table, Container} from 'react-bootstrap';
import { useGetUserProfilesQuery} from '../../slices/usersApiSlice'
import Loader from '../../components/Loader' 
import Message from '../../components/Message' 
import { FaCheck, FaTimes, FaFileUpload } from 'react-icons/fa';
import FileUploader from '../../components/FileUploader'

const UserListScreen = () => {

    const {data: users, error, isLoading, refetch} = useGetUserProfilesQuery();
    
    return (
      <div className='mt-3'>
    <Container>
      <h1>Upload Training Plan</h1>
    {isLoading ? <Loader/> : 
    error ? <Message variant="danger">{error?.data?.message || error.error}</Message> : 
    <>
      <Table striped hover responsive className="table-sm">
        <thead>
          <tr>
            <th>UserId</th>
            <th>Name</th>
            <th><FaFileUpload></FaFileUpload>Upload Training Plan</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
         {users.filter(user => !user.isAdmin).map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td><FileUploader/></td>
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
