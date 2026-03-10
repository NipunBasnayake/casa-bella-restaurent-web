# Casa Bella Ristorante - Italian Fine Dining Website

A full-stack Next.js application for Casa Bella, an Italian fine dining restaurant featuring online reservations, admin management, email notifications, and push notifications.

## 🌟 Features

### Customer-Facing
- **Modern Restaurant Website**: Elegant, responsive design showcasing the restaurant
- **Menu Display**: Categorized Italian menu with appetizers, pasta, mains, and desserts
- **Online Reservations**: Easy-to-use booking system with form validation
- **Gallery**: Beautiful photo gallery of dishes and ambiance
- **Contact Information**: Business hours, location, and contact form
- **Multi-language Support**: Framework ready for internationalization

### Administrative
- **Secure Admin Dashboard**: JWT-based authentication with httpOnly cookies
- **Reservation Management**: View, confirm, or reject reservations
- **Email Notifications**: Automatic confirmation/rejection emails to customers
- **Push Notifications**: Desktop notifications for new reservations (Web Push API)
- **Real-time Updates**: Optimistic UI updates for better UX

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, CSS Modules
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Email**: Nodemailer (SMTP/Gmail)
- **Push Notifications**: Web Push API with VAPID keys

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Gmail account (for email notifications)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the existing `.env.local` file and update with your credentials:
- MongoDB connection string
- Admin credentials
- Gmail credentials (App Password)
- JWT secret

See [SETUP.md](SETUP.md) for detailed configuration instructions.

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Access Admin Dashboard
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and login with credentials from `.env.local`.

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide with MongoDB connection, email configuration, and troubleshooting
- **[SRD.md](SRD.md)** - Full Software Requirements Document (if created)

## 🏗️ Project Structure

```
casa-bella/
├── app/
│   ├── page.tsx              # Home page
│   ├── about/                # About page
│   ├── menu/                 # Menu page
│   ├── gallery/              # Gallery page
│   ├── contact/              # Contact page
│   ├── reservation/          # Reservation form
│   ├── admin/                # Admin dashboard
│   └── api/                  # API routes
│       ├── reservations/     # Reservation CRUD
│       └── admin/            # Admin auth & push
├── components/               # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── LanguageSwitcher.tsx
├── lib/                      # Utilities
│   ├── mongodb.ts           # Database connection
│   ├── initAdmin.ts         # Admin initialization
│   └── hashPassword.ts      # Password utilities
├── models/                   # Mongoose schemas
│   ├── Reservation.ts
│   ├── Admin.ts
│   └── PushSubscription.ts
└── public/
    ├── sw.js                # Service worker
    └── images/              # Static images
```

## 📊 Database Models

### Reservation
- customerName, email, phone (required)
- date, time, guests (required)
- specialRequest (optional)
- status: 'pending' | 'confirmed' | 'rejected'
- timestamps (auto-generated)

### Admin
- username (unique)
- password (bcrypt hashed)
- role (default: 'admin')

### PushSubscription
- endpoint (unique)
- keys (p256dh, auth)

## 🔐 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT tokens with httpOnly cookies
- ✅ SameSite cookie protection (CSRF)
- ✅ Environment variable protection
- ✅ Secure email transmission (TLS)

## 📧 Email Notifications

Customers receive professional HTML emails when:
- ✅ Reservation is confirmed
- ✅ Reservation is rejected

## 🔔 Push Notifications

Admins can subscribe to browser push notifications to receive alerts for new reservations even when the browser is closed.

## 🧪 Testing

### Manual Testing
1. Submit a reservation through the public form
2. Login to admin dashboard
3. Confirm/reject the reservation
4. Verify email is received
5. Test push notifications (if enabled)

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel** (Optimized for Next.js)
- **Netlify**
- **Custom server** with Node.js

### Production Checklist
- [ ] Update all environment variables
- [ ] Change default admin password
- [ ] Generate new JWT secret
- [ ] Configure real email credentials
- [ ] Enable MongoDB IP whitelist
- [ ] Set up SSL/HTTPS (required for push)
- [ ] Test email delivery
- [ ] Test push notifications

## 🐛 Troubleshooting

See [SETUP.md](SETUP.md) for common issues and solutions:
- MongoDB connection errors
- Admin user not created
- Email sending failures
- Push notification issues

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reservations` | GET | Fetch all reservations |
| `/api/reservations` | POST | Create reservation |
| `/api/reservations/[id]/confirm` | PATCH | Confirm + email |
| `/api/reservations/[id]/reject` | PATCH | Reject + email |
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/push-subscribe` | POST | Push subscription |

## 🤝 Contributing

This is a proprietary restaurant website. For bugs or feature requests, contact the development team.

## 📄 License

Private - All rights reserved to Casa Bella Ristorante

## 🆘 Support

For technical support:
1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Review console logs for errors
3. Verify environment variables
4. Check MongoDB connection

---

**Built with ❤️ for Casa Bella Ristorante**  
**Version**: 0.1.0  
**Last Updated**: March 10, 2026
