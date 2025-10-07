import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { generateClient } from "aws-amplify/api";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";

const client = generateClient();

const NotificationsDashboard = () => {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const query = `query ListUserNotifications($filter: ModelUserNotificationFilterInput) {
        listUserNotifications(filter: $filter) {
          items {
            id
            eventType
            name
            description
            reference
            message
            status
            userUserNotificationsId
          }
        }
      }`;
      try {
        const res = await client.graphql({
          query,
          variables: { filter: { userUserNotificationsId: { eq: user.id } } },
        });
        setNotifications(res.data.listUserNotifications.items);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    const subscription = client
      .graphql({
        query: `subscription OnCreateUserNotification {
        onCreateUserNotification {
          id
          eventType
          name
          description
          reference
          message
          status
          userUserNotificationsId
        }
      }`,
      })
      .subscribe({
        next: ({ data }) => {
          const notification = data.onCreateUserNotification;
          // Only add notification if it's for this user
          if (notification.userUserNotificationsId === user.id) {
            setNotifications((prev) => [notification, ...prev]);
          }
        },
        error: (error) => {
          console.error("Subscription error:", error);
        },
      });

    return () => subscription.unsubscribe();
  }, [user.id]);

  const handleApprove = async (notification) => {
    try {
      // Get branches
      const branchesRes = await client.graphql({
        query: `query ListBranches($filter: ModelBranchFilterInput) {
          listBranches(filter: $filter) {
            items { id }
          }
        }`,
        variables: {
          filter: { institutionBranchesId: { eq: user.institutionUsersId } },
        },
      });
      const branchId = branchesRes.data.listBranches.items[0]?.id;
      if (!branchId) {
        alert("No branches found for institution");
        return;
      }

      // Update user
      await client.graphql({
        query: `mutation UpdateUser($input: UpdateUserInput!) {
          updateUser(input: $input) { id }
        }`,
        variables: {
          input: {
            id: notification.reference,
            status: "active",
            branchUsersId: branchId,
          },
        },
      });

      // Create notification for the applicant
      const currentDate = new Date().toISOString().split("T")[0];
      await client.graphql({
        query: `mutation CreateUserNotification($input: CreateUserNotificationInput!) {
          createUserNotification(input: $input) { id }
        }`,
        variables: {
          input: {
            eventType: "user_join_approved",
            name: "Join Request Approved",
            description:
              "Your request to join the institution has been approved.",
            reference: user.institutionUsersId,
            message: `Your access has been approved on ${currentDate}. You can now access all features.`,
            status: "unread",
            userUserNotificationsId: notification.reference,
          },
        },
      });

      // Mark notification as read
      await client.graphql({
        query: `mutation UpdateUserNotification($input: UpdateUserNotificationInput!) {
          updateUserNotification(input: $input) { id }
        }`,
        variables: { input: { id: notification.id, status: "read" } },
      });

      // Update state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, status: "read" } : n
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Failed to approve user");
    }
  };

  const handleReject = async (notification) => {
    try {
      // Update user to inactive
      await client.graphql({
        query: `mutation UpdateUser($input: UpdateUserInput!) {
          updateUser(input: $input) { id }
        }`,
        variables: {
          input: {
            id: notification.reference,
            status: "inactive",
          },
        },
      });

      // Create notification for the applicant
      const currentDate = new Date().toISOString().split("T")[0];
      await client.graphql({
        query: `mutation CreateUserNotification($input: CreateUserNotificationInput!) {
          createUserNotification(input: $input) { id }
        }`,
        variables: {
          input: {
            eventType: "user_join_rejected",
            name: "Join Request Declined",
            description:
              "Your request to join the institution has been declined.",
            reference: user.institutionUsersId,
            message: `Your access request was declined on ${currentDate}. Please contact your administrator for more information.`,
            status: "unread",
            userUserNotificationsId: notification.reference,
          },
        },
      });

      // Mark notification as read
      await client.graphql({
        query: `mutation UpdateUserNotification($input: UpdateUserNotificationInput!) {
          updateUserNotification(input: $input) { id }
        }`,
        variables: { input: { id: notification.id, status: "read" } },
      });

      // Update state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, status: "read" } : n
        )
      );
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("Failed to reject user");
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <Stack spacing={2}>
        {notifications
          .filter((n) => n.status === "unread")
          .map((notification) => (
            <Card key={notification.id}>
              <CardContent>
                <Typography variant="h6">{notification.name}</Typography>
                <Typography>{notification.message}</Typography>
                {notification.eventType === "user_join_request" && (
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApprove(notification)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleReject(notification)}
                    >
                      Reject
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
      </Stack>
    </Box>
  );
};

export default NotificationsDashboard;
