// Custom cursor follower removed per portfolio specification
export function initCustomCursor() {
    // Ensure any previously created custom cursor elements are cleaned up
    const existingCursor = document.querySelector('.cursor');
    const existingFollower = document.querySelector('.cursor-follower');
    if (existingCursor) existingCursor.remove();
    if (existingFollower) existingFollower.remove();
    document.body.classList.remove('custom-cursor-active');
}
