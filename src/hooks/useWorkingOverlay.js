import React, { useState } from "react";
import WorkingOverlay from "../ModelAssets/WorkingOverlay";

/**
 * Custom hook to manage WorkingOverlay state and rendering
 * Usage:
 *   const { overlay, showOverlay, hideOverlay, setOverlayMessage } = useWorkingOverlay();
 *   
 *   // In component:
 *   showOverlay("Saving Borrower");
 *   await apiCall();
 *   hideOverlay();
 */
export function useWorkingOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Working...");

  const showOverlay = (msg = "Working...") => {
    setMessage(msg);
    setIsOpen(true);
  };

  const hideOverlay = () => {
    setIsOpen(false);
  };

  const setOverlayMessage = (msg) => {
    setMessage(msg);
  };

  const overlay = (
    <WorkingOverlay open={isOpen} message={message} />
  );

  return {
    overlay,
    showOverlay,
    hideOverlay,
    setOverlayMessage,
    isOpen,
  };
}
