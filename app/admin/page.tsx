'use client';
import { useState, useEffect } from 'react';
import styles from './Admin.module.css';

// Base64Url helper for Web Push
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [reservations, setReservations] = useState<any[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    // Basic check: if we can fetch reservations, we are authenticated
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        setIsAuthenticated(true);
        fetchReservations();
        checkPushSubscription();
      }
    } catch {
      // Ignored
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetchReservations();
        checkPushSubscription();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (err) {
      console.error('Failed to fetch', err);
    }
  };

  const checkPushSubscription = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.getSubscription();
      setPushEnabled(!!subscription);
    }
  };

  const enablePushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert("Push notifications not supported by this browser.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert("Permission denied!");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicVapidKey) {
        throw new Error("VAPID missing from env");
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      // Send subscription to server
      await fetch('/api/admin/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      setPushEnabled(true);
      alert("You will now receive notifications when a new reservation comes in, even when the browser is closed!");

    } catch (err) {
      console.error('Failed to subscribe to push services:', err);
      alert("Failed to subscribe");
    }
  };

  const confirmReservation = async (id: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}/confirm`, {
        method: 'PATCH'
      });
      if (res.ok) {
        // optimistically update UI
        setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'confirmed' } : r));
        alert("Confirmed and email sent to user!");
      } else {
        alert("Failed to confirm");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const rejectReservation = async (id: string) => {
    if (!confirm('Are you sure you want to reject this reservation?')) return;
    try {
      const res = await fetch(`/api/reservations/${id}/reject`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setReservations(prev => prev.map(r => r._id === id ? { ...r, status: 'rejected' } : r));
        alert("Rejected and email sent to user!");
      } else {
        alert("Failed to reject");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.loginCard}>
          <h2>Admin Access</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.dashboardHeader}>
        <div className={`container ${styles.dashboardHeaderWrapper}`}>
          <h1>Admin Portal</h1>
          <button
            className={pushEnabled ? "btn btn-secondary" : "btn btn-primary"}
            onClick={enablePushNotifications}
            disabled={pushEnabled}
            style={pushEnabled ? { borderColor: 'var(--color-accent-gold)', color: 'var(--color-primary-light)' } : {}}
          >
            {pushEnabled ? "Desktop Notifications Active" : "Enable Notifications"}
          </button>
        </div>
      </header>

      <main className="container" style={{ marginTop: '3rem' }}>
        <div className={styles.resTableWrapper}>
          <table className={styles.resTable}>
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Contact Info</th>
                <th>Date & Time</th>
                <th>Party Size</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res._id}>
                  <td>
                    <strong style={{ color: 'var(--color-primary-dark)' }}>{res.name}</strong><br />
                    {res.requests && <span style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>{res.requests}</span>}
                  </td>
                  <td>
                    <span style={{ color: '#4a4a4a' }}>{res.phone}</span><br />
                    <a href={`mailto:${res.email}`} style={{ color: 'var(--color-accent-gold)', textDecoration: 'underline' }}>{res.email}</a>
                  </td>
                  <td>
                    <strong>{res.date}</strong><br />
                    <span style={{ color: '#666' }}>{res.time}</span>
                  </td>
                  <td>{res.guests} <span style={{ fontSize: '0.9rem', color: '#666' }}>People</span></td>
                  <td>
                    <span className={res.status === 'confirmed' ? styles.badgeSuccess : res.status === 'rejected' ? styles.badgeRejected : styles.badgePending}>
                      {res.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {res.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => confirmReservation(res._id)}>
                          Confirm
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: '#d9534f', color: '#d9534f' }} onClick={() => rejectReservation(res._id)}>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}>
                    <div style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}>🍽️</div>
                    <p>No reservations currently on file.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
