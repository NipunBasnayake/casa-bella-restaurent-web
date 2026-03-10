'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './Admin.module.css';

interface Reservation {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

interface ReservationActionResponse {
  reservation?: Reservation;
  emailSent?: boolean;
  emailWarning?: string | null;
  error?: string;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pushEnabled, setPushEnabled] = useState(false);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/api/reservations', { cache: 'no-store' });

      if (res.status === 401) {
        setIsAuthenticated(false);
        setReservations([]);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const data = (await res.json()) as Reservation[];
      setReservations(data);
    } catch (fetchError) {
      console.error('Failed to fetch reservations', fetchError);
    }
  }, []);

  const checkPushSubscription = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.getSubscription();
      setPushEnabled(Boolean(subscription));
    } catch (subscriptionError) {
      console.error('Failed to check push subscription', subscriptionError);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/me', { cache: 'no-store' });

      if (!res.ok) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      await fetchReservations();
      await checkPushSubscription();
    } catch {
      setIsAuthenticated(false);
    }
  }, [checkPushSubscription, fetchReservations]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError('Invalid credentials');
        return;
      }

      await checkAuth();
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setIsAuthenticated(false);
      setReservations([]);
      setPushEnabled(false);
      setPassword('');
    }
  };

  const enablePushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Push notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Permission denied.');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!publicVapidKey) {
        throw new Error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing');
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      const res = await fetch('/api/admin/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        alert('Session expired. Please log in again.');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to register push subscription');
      }

      setPushEnabled(true);
      alert('Desktop notifications are now enabled.');
    } catch (subscriptionError) {
      console.error('Failed to subscribe to push notifications', subscriptionError);
      alert('Failed to enable push notifications.');
    }
  };

  const updateReservationStatusInState = (
    id: string,
    status: Reservation['status']
  ) => {
    setReservations((previousReservations) =>
      previousReservations.map((reservation) =>
        reservation._id === id ? { ...reservation, status } : reservation
      )
    );
  };

  const handleReservationAction = async (
    id: string,
    action: 'confirm' | 'reject'
  ) => {
    try {
      const res = await fetch(`/api/reservations/${id}/${action}`, {
        method: 'PATCH',
      });

      const payload = (await res.json().catch(() => null)) as ReservationActionResponse | null;

      if (res.status === 401) {
        setIsAuthenticated(false);
        alert('Session expired. Please log in again.');
        return;
      }

      if (!res.ok) {
        alert(payload?.error || `Failed to ${action} reservation.`);
        return;
      }

      updateReservationStatusInState(id, action === 'confirm' ? 'confirmed' : 'rejected');

      if (payload?.emailSent === false && payload.emailWarning) {
        alert(
          `Reservation ${action}ed, but email was not delivered: ${payload.emailWarning}`
        );
      } else {
        alert(`Reservation ${action}ed successfully.`);
      }
    } catch (actionError) {
      console.error(`Failed to ${action} reservation`, actionError);
      alert(`Failed to ${action} reservation.`);
    }
  };

  const confirmReservation = async (id: string) => {
    await handleReservationAction(id, 'confirm');
  };

  const rejectReservation = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this reservation?')) {
      return;
    }

    await handleReservationAction(id, 'reject');
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
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={loading}
            >
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
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className={pushEnabled ? 'btn btn-secondary' : 'btn btn-primary'}
              onClick={enablePushNotifications}
              disabled={pushEnabled}
              style={
                pushEnabled
                  ? {
                      borderColor: 'var(--color-accent-gold)',
                      color: 'var(--color-primary-light)',
                    }
                  : {}
              }
            >
              {pushEnabled ? 'Desktop Notifications Active' : 'Enable Notifications'}
            </button>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ marginTop: '3rem' }}>
        <div className={styles.resTableWrapper}>
          <table className={styles.resTable}>
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Contact Info</th>
                <th>Date and Time</th>
                <th>Party Size</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>
                    <strong style={{ color: 'var(--color-primary-dark)' }}>
                      {reservation.customerName}
                    </strong>
                    <br />
                    {reservation.specialRequest && (
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color: '#666',
                          fontStyle: 'italic',
                        }}
                      >
                        {reservation.specialRequest}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ color: '#4a4a4a' }}>{reservation.phone}</span>
                    <br />
                    <a
                      href={`mailto:${reservation.email}`}
                      style={{
                        color: 'var(--color-accent-gold)',
                        textDecoration: 'underline',
                      }}
                    >
                      {reservation.email}
                    </a>
                  </td>
                  <td>
                    <strong>{reservation.date}</strong>
                    <br />
                    <span style={{ color: '#666' }}>{reservation.time}</span>
                  </td>
                  <td>
                    {reservation.guests}{' '}
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>People</span>
                  </td>
                  <td>
                    <span
                      className={
                        reservation.status === 'confirmed'
                          ? styles.badgeSuccess
                          : reservation.status === 'rejected'
                            ? styles.badgeRejected
                            : styles.badgePending
                      }
                    >
                      {reservation.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {reservation.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                          onClick={() => confirmReservation(reservation._id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            borderColor: '#d9534f',
                            color: '#d9534f',
                          }}
                          onClick={() => rejectReservation(reservation._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', padding: '4rem 2rem', color: '#666' }}
                  >
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
