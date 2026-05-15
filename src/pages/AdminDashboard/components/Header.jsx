import { Search, Bell, User, RefreshCw, Shield, Terminal } from 'lucide-react'
import { apiFetch, getTokenPayload } from '../../../api'
import { useState, useEffect } from 'react'

export default function Header({ alerts = [] }) {
    const pendingCount = alerts?.filter(a => a.status === 'pending').length || 0
    const [subscribing, setSubscribing] = useState(false)
    const [user, setUser] = useState({ name: 'Admin', role: 'admin' })

    useEffect(() => {
        const payload = getTokenPayload();
        if (payload) setUser(payload);
    }, []);

    const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'AD';

    const handleSubscribe = async () => {
        try {
            setSubscribing(true)

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error("You must click 'Allow' on the browser prompt to receive alerts.");
            }

            const registration = await navigator.serviceWorker.ready;

            // Get VAPID public key
            const res = await apiFetch("/api/push/vapidPublicKey");

            const urlB64ToUint8Array = (base64String) => {
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);
                for (let i = 0; i < rawData.length; ++i) {
                    outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
            };

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(res.publicKey)
            });

            // Send to backend
            await apiFetch("/api/push/subscribe", {
                method: 'POST',
                body: { subscription }
            });

            alert("Background Push Notifications successfully enabled!");
        } catch (err) {
            console.error(err)
            alert("Failed to enable push notifications: " + err.message);
        } finally {
            setSubscribing(false)
        }
    }

    return (
        <header className="adm-header bg-card border-b border-border px-24 h-64 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-16">
                <div className="adm-search-container flex items-center bg-secondary border border-border rounded-md px-12 py-6 min-w-[320px]">
                    <Search className="text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search alerts, users..."
                        className="bg-transparent border-none outline-none text-sm ml-8 text-primary w-full placeholder:text-muted"
                    />
                </div>
            </div>

            <div className="flex items-center gap-20">
                <div className="system-ping flex items-center gap-8">
                    <div className="status-dot live" />
                    <span className="text-xs text-secondary">System Online</span>
                </div>

                <div className="h-24 w-1 bg-border" />

                <div className="flex items-center gap-16">
                    <button
                        onClick={handleSubscribe}
                        title="Enable Push Notifications"
                        className="relative p-8 text-secondary hover:text-primary transition-colors disabled:opacity-50"
                        disabled={subscribing}
                    >
                        <Bell size={18} />
                        {pendingCount > 0 && (
                            <span className="absolute top-2 right-2 w-8 h-8 bg-red rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                                {pendingCount}
                            </span>
                        )}
                    </button>

                    <div className="flex items-center gap-12 pl-8 border-l border-border">
                        <div className="flex flex-col items-end hide-mobile">
                            <span className="text-xs font-bold leading-tight">{user.name}</span>
                            <span className="text-[10px] text-muted capitalize mt-2">{user.role}</span>
                        </div>
                        <div className="w-32 h-32 rounded-lg bg-blue flex items-center justify-center font-bold text-xs text-white">
                            {initials}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
