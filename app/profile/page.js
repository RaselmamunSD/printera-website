'use client';
import withAuth from '../../src/components/withAuth';
import { useAuth } from '../../src/context/AuthContext';

function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>First Name: {user.first_name}</p>
          <p>Last Name: {user.last_name}</p>
          {user.profile_picture && (
            <img src={user.profile_picture} alt="Profile" width="100" height="100" />
          )}
        </div>
      )}
    </div>
  );
}

export default withAuth(Profile);
