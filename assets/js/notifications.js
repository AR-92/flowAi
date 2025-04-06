document.addEventListener('DOMContentLoaded', () => {
    const notificationListContainer = document.getElementById('notification-list');
    const markAllReadButton = document.getElementById('mark-all-read');
    const emptyStateMessage = document.getElementById('empty-state-message');

    // --- Simulated Notification Data ---
    // In a real application, this would be fetched from a backend API.
    let notifications = [
        { id: 1, type: 'comment', title: 'New comment on your post', message: '"This is a great point! I hadn\'t considered that perspective before."', sender: 'User123', time: '5 minutes ago', read: false, icon: 'message-square-plus', iconColor: 'text-blue-400', borderColor: 'border-blue-500' },
        { id: 2, type: 'follow', title: 'New follower', message: 'JaneDoe started following you.', sender: null, time: '1 hour ago', read: true, icon: 'user-plus', iconColor: 'text-green-400', borderColor: null },
        { id: 3, type: 'system', title: 'Security Update', message: 'Your account password was successfully updated.', sender: null, time: 'Yesterday', read: false, icon: 'shield-check', iconColor: 'text-purple-400', borderColor: 'border-purple-500' },
        { id: 4, type: 'mention', title: 'You were mentioned', message: 'Alex mentioned you in the #general channel.', sender: 'Alex', time: '2 days ago', read: true, icon: 'at-sign', iconColor: 'text-yellow-400', borderColor: null },
    ];
    // ------------------------------------

    function renderNotifications() {
        if (!notificationListContainer) return; // Guard clause

        notificationListContainer.innerHTML = ''; // Clear existing static content

        if (notifications.length === 0) {
            if (emptyStateMessage) emptyStateMessage.classList.remove('hidden');
            return;
        } else {
             if (emptyStateMessage) emptyStateMessage.classList.add('hidden');
        }


        notifications.forEach(notification => {
            const notificationElement = document.createElement('div');
            notificationElement.classList.add(
                'p-4', 'rounded-lg', 'flex', 'items-start', 'space-x-3', 'transition-opacity', 'duration-300'
            );
            notificationElement.dataset.id = notification.id; // Add data-id for easier targeting

            if (notification.read) {
                notificationElement.classList.add('bg-gray-950', 'opacity-70');
            } else {
                notificationElement.classList.add('bg-gray-900');
                if (notification.borderColor) {
                    notificationElement.classList.add('border-l-4', notification.borderColor);
                }
            }

            const readIcon = notification.read ? 'circle' : 'circle-dot';
            const readTitle = notification.read ? 'Mark as unread' : 'Mark as read';
            const readIconColor = notification.read ? 'text-gray-600' : 'text-gray-500';
            const readIconHoverColor = notification.read ? 'hover:text-gray-400' : 'hover:text-gray-300';

            notificationElement.innerHTML = `
                <div class="flex-shrink-0 pt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${notification.icon} ${notification.iconColor}">
                        <!-- Dynamically load correct icon paths if needed, or use a library -->
                        ${getIconPath(notification.icon)}
                    </svg>
                </div>
                <div class="flex-grow">
                    <p class="text-sm font-medium ${notification.read ? 'text-gray-300' : 'text-gray-200'}">${notification.title}</p>
                    <p class="text-xs text-gray-400 mt-1">${notification.message}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        ${notification.sender ? `From: ${notification.sender} - ` : ''}${notification.time}
                    </p>
                </div>
                <div class="flex-shrink-0">
                    <button class="mark-read-toggle text-xs ${readIconColor} ${readIconHoverColor}" title="${readTitle}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${readIcon}">
                           ${getIconPath(readIcon)}
                        </svg>
                    </button>
                </div>
            `;
            notificationListContainer.appendChild(notificationElement);
        });
    }

    // --- Event Listeners ---

    // Mark individual notification read/unread
    if (notificationListContainer) {
        notificationListContainer.addEventListener('click', (event) => {
            const toggleButton = event.target.closest('.mark-read-toggle');
            if (toggleButton) {
                const notificationElement = event.target.closest('[data-id]');
                const notificationId = parseInt(notificationElement.dataset.id, 10);

                // Find and update the notification in the data array
                notifications = notifications.map(notif => {
                    if (notif.id === notificationId) {
                        // In a real app, send update to backend here
                        console.log(`Toggling read status for notification ID: ${notificationId}`);
                        return { ...notif, read: !notif.read };
                    }
                    return notif;
                });

                // Re-render the list
                renderNotifications();
            }
        });
    }

    // Mark all as read
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', () => {
            // In a real app, send update to backend here
            console.log('Marking all notifications as read');
            notifications = notifications.map(notif => ({ ...notif, read: true }));
            renderNotifications();
        });
    }

    // --- Initial Render ---
    renderNotifications();

});

// Helper to get SVG paths (replace with actual paths or library)
// This is a simplified placeholder
function getIconPath(iconName) {
    switch (iconName) {
        case 'message-square-plus': return '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" x2="12" y1="7" y2="13"/><line x1="9" x2="15" y1="10" y2="10"/>';
        case 'user-plus': return '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>';
        case 'shield-check': return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>';
        case 'at-sign': return '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>';
        case 'circle-dot': return '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>';
        case 'circle': return '<circle cx="12" cy="12" r="10"/>';
        default: return ''; // Handle unknown icons
    }
}
