// High-Performance Custom Cursor Module
export function initCustomCursor() {
    // Only init on desktop / non-coarse pointer devices
    if (window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches) return;
    
    // Prevent duplicate cursor elements
    if (document.querySelector('.cursor')) return;
    
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    
    const cursorFollower = document.createElement('div');
    cursorFollower.classList.add('cursor-follower');
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    document.body.classList.add('custom-cursor-active');
    
    let mouseX = -100, mouseY = -100;
    let followerX = -100, followerY = -100;
    let isMoving = true;
    let hasMoved = false;
    
    // Track mouse movement with GPU transform
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        if (!hasMoved) {
            followerX = mouseX;
            followerY = mouseY;
            hasMoved = true;
        }
        
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });
    
    // Smooth follower animation loop
    function animateFollower() {
        if (isMoving) {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            followerX += dx * 0.25;
            followerY += dy * 0.25;
            
            cursorFollower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
            
            if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
                isMoving = false;
            }
        }
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Event delegation for dynamic hover effects
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .btn, input, textarea, select, .project-card, .skill-card, .timeline-item, .achievement-card, .filter-btn')) {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .btn, input, textarea, select, .project-card, .skill-card, .timeline-item, .achievement-card, .filter-btn')) {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        }
    });
}
