'use client';
import withAuth from '../../src/components/withAuth';

function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <p>This is a protected page.</p>
    </div>
  );
}

export default withAuth(Profile);
