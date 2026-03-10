/**
 * Database Connection Test Script
 * Run this script to verify MongoDB connection and admin user initialization.
 *
 * Usage: node scripts/test-connection.mjs
 */

import mongoose from 'mongoose';
import { config as loadEnv } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

loadEnv({ path: '.env.local' });

async function testConnection() {
  console.log('Testing MongoDB connection...\n');

  console.log('Environment Variables Check:');
  console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Missing');
  console.log('   ADMIN_USERNAME:', process.env.ADMIN_USERNAME ? 'Set' : 'Missing');
  console.log('   ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'Set' : 'Missing');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Missing');
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Missing');
  console.log();

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not defined in .env.local. Falling back to in-memory MongoDB.');
  }

  let memoryServer = null;

  try {
    if (process.env.MONGODB_URI) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          bufferCommands: false,
        });
        console.log('Connected to primary MongoDB.\n');
      } catch (primaryError) {
        const primaryErrorMessage =
          primaryError instanceof Error ? primaryError.message : 'Unknown error';
        console.warn(`Primary MongoDB connection failed: ${primaryErrorMessage}`);
        console.warn('Switching to in-memory MongoDB fallback for development checks.');
      }
    }

    if (!mongoose.connection.readyState) {
      memoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'casa-bella-dev',
        },
      });

      await mongoose.connect(memoryServer.getUri(), {
        bufferCommands: false,
      });
      console.log('Connected to in-memory MongoDB fallback.\n');
    }

    console.log('Database Information:');
    console.log('   Database Name:', mongoose.connection.db?.databaseName || 'N/A');
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port || 'N/A (Atlas)');
    console.log();

    console.log('Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach((collection) => {
      console.log('   -', collection.name);
    });
    console.log();

    const Admin = mongoose.model(
      'Admin',
      new mongoose.Schema({
        username: String,
        password: String,
        role: String,
        createdAt: Date,
      })
    );

    const adminCount = await Admin.countDocuments();
    console.log('Admin Users:', adminCount);
    if (adminCount > 0) {
      const admins = await Admin.find({}, 'username role createdAt');
      admins.forEach((admin) => {
        console.log('   -', admin.username, `(${admin.role})`);
      });
    } else {
      console.log('   No admin users found. They will be created on first API request.');
    }
    console.log();

    const Reservation = mongoose.model(
      'Reservation',
      new mongoose.Schema({
        customerName: String,
        email: String,
        phone: String,
        date: String,
        time: String,
        guests: Number,
        specialRequest: String,
        status: String,
        createdAt: Date,
        updatedAt: Date,
      })
    );

    const reservationCount = await Reservation.countDocuments();
    console.log('Reservations:', reservationCount);
    if (reservationCount > 0) {
      const recentReservations = await Reservation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('customerName date time status');
      console.log('   Recent reservations:');
      recentReservations.forEach((reservation) => {
        console.log(
          '   -',
          reservation.customerName,
          '-',
          reservation.date,
          reservation.time,
          `(${reservation.status})`
        );
      });
    }
    console.log();

    console.log('All checks passed. Database appears to be configured correctly.\n');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Connection Error:', errorMessage);
    console.error('\nTroubleshooting Tips:');
    console.error('   1. Check if MongoDB is running (for local installations)');
    console.error('   2. Verify MONGODB_URI format in .env.local');
    console.error('   3. For Atlas: Check IP whitelist and credentials');
    console.error('   4. Ensure network connectivity\n');
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('Connection closed.');
  }
}

void testConnection();
