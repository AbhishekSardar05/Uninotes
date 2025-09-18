import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const UserSync = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      syncUserWithBackend(user);
    }
  }, [isLoaded, user]);

  const syncUserWithBackend = async (clerkUser) => {
    try {
      console.log('🔄 Syncing user with backend:', clerkUser.id);
      
      const response = await fetch('http://localhost:5000/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          role: 'student'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ User synced successfully:', data.user);
      } else {
        console.warn('⚠️ User sync failed:', data.message);
      }
    } catch (error) {
      console.error('❌ Error syncing user:', error);
    }
  };

  return null; // This component doesn't render anything
};

export default UserSync;