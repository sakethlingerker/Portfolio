// Toast Notification System
class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        // Create container if it doesn't exist
        if (!document.querySelector('.toast-container')) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.querySelector('.toast-container');
        }
    }

    show(options = {}) {
        const {
            type = 'info', // success, error, warning, info
            title = '',
            message = '',
            duration = 5000,
            closable = true,
            progress = true
        } = options;

        // Generate unique ID
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.id = id;

        // Get icon based on type
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };

        // Build toast HTML
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-content">
                ${title ? `<p class="toast-title">${title}</p>` : ''}
                ${message ? `<p class="toast-message">${message}</p>` : ''}
            </div>
            ${closable ? '<button class="toast-close" aria-label="Close notification"><i class="fas fa-times"></i></button>' : ''}
            ${progress ? '<div class="toast-progress"><div class="toast-progress-bar"></div></div>' : ''}
        `;

        // Add to container
        this.container.appendChild(toast);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Store toast reference
        this.toasts.set(id, {
            element: toast,
            timeout: null
        });

        // Add close button handler
        if (closable) {
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.hide(id));
        }

        // Auto-hide after duration
        if (duration > 0) {
            const timeout = setTimeout(() => this.hide(id), duration);
            this.toasts.get(id).timeout = timeout;
        }

        return id;
    }

    hide(id) {
        const toastData = this.toasts.get(id);
        if (!toastData) return;

        const { element, timeout } = toastData;

        // Clear timeout
        if (timeout) clearTimeout(timeout);

        // Trigger exit animation
        element.classList.remove('show');
        element.classList.add('hide');

        // Remove from DOM after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.toasts.delete(id);
        }, 400);
    }

    hideAll() {
        this.toasts.forEach((_, id) => this.hide(id));
    }

    // Convenient methods
    success(title, message, duration) {
        return this.show({ type: 'success', title, message, duration });
    }

    error(title, message, duration) {
        return this.show({ type: 'error', title, message, duration });
    }

    warning(title, message, duration) {
        return this.show({ type: 'warning', title, message, duration });
    }

    info(title, message, duration) {
        return this.show({ type: 'info', title, message, duration });
    }
}

// Create global instance
const toast = new ToastManager();

// Export for module usage
export { toast, ToastManager };
