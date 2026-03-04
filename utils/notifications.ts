
// Sound effect for new reservations
export const playNotificationSound = () => {
    try {
        // A pleasant "ding" sound
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Audio play failed (interaction needed first):", e));
    } catch (e) {
        console.error("Audio error", e);
    }
};

export const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
    }
    if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
};

export const sendNotification = (title: string, body: string) => {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
            icon: '/vite.svg' // Fallback icon
        });
    }
};
