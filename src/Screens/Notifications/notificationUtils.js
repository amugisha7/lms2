// Helper utilities for formatting and filtering notifications

export const formatNotificationDate = (dateString) => {
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
  if (!user) return "System";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.email || "Unknown User";
};

export const getNotificationPreview = (body, maxLength = 50) => {
  if (!body) return "";
  if (body.length <= maxLength) return body;
  return body.substring(0, maxLength) + "...";
};

export const searchNotifications = (notifications, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === "") return notifications;

  const term = searchTerm.toLowerCase();
  return notifications.filter(
    (notification) =>
      notification.subject?.toLowerCase().includes(term) ||
      notification.body?.toLowerCase().includes(term) ||
      getUserDisplayName(notification.sender).toLowerCase().includes(term)
  );
};
