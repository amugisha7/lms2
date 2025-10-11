import { useState, useEffect, useContext } from 'react';
import { generateClient } from 'aws-amplify/api';
import { UserContext } from '../../App';
import { LIST_MESSAGES_QUERY, SUBSCRIBE_TO_NEW_MESSAGES } from './messagingQueries';

const client = generateClient();

export const useUnreadMessageCount = () => {
  const { userDetails } = useContext(UserContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userDetails?.id) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await client.graphql({
          query: LIST_MESSAGES_QUERY,
          variables: {
            filter: {
              recipientUserId: { eq: userDetails.id },
              status: { eq: 'unread' }
            }
          }
        });
        setUnreadCount(response.data.listMessages.items.length);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadCount();

    // Subscribe to new messages
    const subscription = client.graphql({
      query: SUBSCRIBE_TO_NEW_MESSAGES,
      variables: { filter: { recipientUserId: { eq: userDetails.id } } }
    }).subscribe({
      next: ({ data }) => {
        // New message received, increment count
        setUnreadCount(prev => prev + 1);
      },
      error: (error) => {
        console.error('Subscription error:', error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userDetails?.id]);

  return unreadCount;
};