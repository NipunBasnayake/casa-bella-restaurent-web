import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

let isInitialized = false;

export async function initAdmin() {
  if (isInitialized) return;
  
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.log('⚠️ Skipping admin initialization: ADMIN_USERNAME or ADMIN_PASSWORD missing in .env.local');
      console.log('   Add these to enable automatic admin user creation.');
      return;
    }

    const existingAdmin = await Admin.findOne({ username: adminUsername });
    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${adminUsername}`);
      isInitialized = true;
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await Admin.create({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Default admin user successfully initialized!');
    console.log(`   Username: ${adminUsername}`);
    console.log('   Password: (set in .env.local)');
    console.log('   Access admin dashboard at: /admin');
    
    isInitialized = true;
  } catch (error) {
    console.error('❌ Failed to initialize admin:', error);
    if (error instanceof Error) {
      console.error('   Error details:', error.message);
    }
  }
}
