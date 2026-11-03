import { toast } from "./toast.js";

/**
 * Convenience helper to display a toast notification
 * Delegates to the unified ToastManager in toast.js to avoid duplicate DOM logic
 * @param {string} message
 * @param {"success" | "error" | "warning" | "info"} type
 */
export function showToast(message, type = "success") {
  const titles = {
    success: "Success!",
    error: "Error!",
    warning: "Warning!",
    info: "Info"
  };
  return toast.show({
    type,
    title: titles[type] || "Notification",
    message,
    duration: 5000,
    closable: true,
    progress: true
  });
}

/**
 * Sets up global listeners for uncaught errors and unhandled promise rejections
 */
export function setupGlobalErrorHandling() {
  window.addEventListener("error", (event) => {
    console.error("Global Error:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled Rejection:", event.reason);
  });
}
