// High-Performance Custom Cursor Module
export function initCustomCursor() {
    // Only init on desktop
    if (window.innerWidth <= 768) return;
    
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    
    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let isMoving = false;
    
    // Track mouse movement - use transform for better performance
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        // Update main cursor immediately with transform (GPU accelerated)
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });
    
    // Smooth follower movement with higher speed
    function animateFollower() {
        if (isMoving) {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            // Increased from 0.1 to 0.2 for faster, more responsive movement
            followerX += dx * 0.2;
            followerY += dy * 0.2;
            
            // Use transform3d for GPU acceleration
            cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
            
            // Stop animation if cursor is barely moving
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
                isMoving = false;
            }
        }
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, select, .project-card, .skill-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}
