export const popupService = {
    show(title, message, type = 'info', onConfirm = null) {
        window.dispatchEvent(new CustomEvent('show-popup', {
            detail: { title, message, type, onConfirm }
        }));
    },
    success(title, message) {
        this.show(title, message, 'success');
    },
    warning(title, message) {
        this.show(title, message, 'warning');
    },
    info(title, message) {
        this.show(title, message, 'info');
    },
    error(title, message) {
        this.show(title, message, 'warning'); // Following user's specific request for red as warning
    },
    confirm(title, message, onConfirm) {
        this.show(title, message, 'confirm', onConfirm);
    }
};
