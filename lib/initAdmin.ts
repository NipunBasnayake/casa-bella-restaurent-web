import Admin from '@/models/Admin';
import { hashPassword } from '@/lib/hashPassword';

let isInitialized = false;

export async function initAdmin() {
  if (isInitialized) return;
  
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.log('Skipping admin initialization: ADMIN_USERNAME or ADMIN_PASSWORD missing.');
      return;
    }

    const existingAdmin = await Admin.findOne({ username: adminUsername });
    if (!existingAdmin) {
      await Admin.create({
        username: adminUsername,
        passwordHash: hashPassword(adminPassword),
      });
      console.log('Default admin user successfully initialized.');
    }
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize admin:', error);
  }
}
