'use strict';

const AlertSystem = {
    container: null,

    init() {
        this.container = document.getElementById('alert-container');

        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'alert-container';
            this.container.className = 'alert-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 5000) {
        if (!this.container) {
            this.init();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            ${message}
            <button class="alert-close">&times;</button>
        `;

        const closeButton = alert.querySelector('.alert-close');
        closeButton.addEventListener('click', () => {
            this.removeAlert(alert);
        });

        this.container.appendChild(alert);

        if (duration > 0) {
            setTimeout(() => {
                if (alert.parentNode === this.container) {
                    this.removeAlert(alert);
                }
            }, duration);
        }

        return alert;
    },

    removeAlert(alert) {
        alert.classList.add('alert-removing');
        setTimeout(() => {
            if (alert.parentNode === this.container) {
                this.container.removeChild(alert);
            }
        }, 300);
    },

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    },

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration = 5000) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
};