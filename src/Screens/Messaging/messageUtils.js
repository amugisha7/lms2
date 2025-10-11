// Helper utilities for formatting and filtering messages

export const formatMessageDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatFullDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getUserDisplayName = (user) => {
  if (!user) return "Unknown User";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.email || "Unknown User";
};

export const getMessagePreview = (body, maxLength = 50) => {
  if (!body) return "";
  if (body.length <= maxLength) return body;
  return body.substring(0, maxLength) + "...";
};

export const filterMessagesByType = (messages, type) => {
  if (!type || type === "all") return messages;
  return messages.filter((msg) => msg.messageType === type);
};

export const filterUnreadMessages = (messages) => {
  return messages.filter((msg) => msg.status === "unread");
};

export const sortMessagesByDate = (messages, ascending = false) => {
  return [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const groupMessagesByConversation = (messages, currentUserId) => {
  const conversations = {};

  messages.forEach((message) => {
    // Determine the other user in the conversation
    const otherUserId =
      message.senderUserId === currentUserId
        ? message.recipientUserId
        : message.senderUserId;

    if (!conversations[otherUserId]) {
      conversations[otherUserId] = {
        userId: otherUserId,
        user:
          message.senderUserId === currentUserId
            ? message.recipient
            : message.sender,
        messages: [],
        lastMessage: null,
        unreadCount: 0,
      };
    }

    conversations[otherUserId].messages.push(message);

    // Update last message
    if (
      !conversations[otherUserId].lastMessage ||
      new Date(message.createdAt) >
        new Date(conversations[otherUserId].lastMessage.createdAt)
    ) {
      conversations[otherUserId].lastMessage = message;
    }

    // Count unread messages (only for received messages)
    if (
      message.recipientUserId === currentUserId &&
      message.status === "unread"
    ) {
      conversations[otherUserId].unreadCount++;
    }
  });

  // Convert to array and sort by last message date
  return Object.values(conversations).sort((a, b) => {
    return (
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  });
};

export const searchMessages = (messages, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") return messages;

  const term = searchTerm.toLowerCase();
  return messages.filter(
    (msg) =>
      msg.subject?.toLowerCase().includes(term) ||
      msg.body?.toLowerCase().includes(term) ||
      getUserDisplayName(msg.sender).toLowerCase().includes(term) ||
      getUserDisplayName(msg.recipient).toLowerCase().includes(term)
  );
};
