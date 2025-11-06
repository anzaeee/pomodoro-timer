const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const email = 'test@example.com';
    const password = 'test123';
    const name = 'Test User';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Test user already exists. Deleting and recreating...');
      await prisma.user.delete({
        where: { email },
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    console.log('Test user created:', user.email);

    // Create preferences
    const preferences = await prisma.preference.create({
      data: {
        userId: user.id,
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        autoStartBreaks: true,
        autoStartPomodoros: false,
        longBreakInterval: 4,
        soundEnabled: true,
      },
    });

    console.log('Preferences created');

    // Create custom presets
    const presets = [
      {
        name: 'Focus Mode',
        workDuration: 45,
        shortBreak: 10,
        longBreak: 20,
      },
      {
        name: 'Quick Sessions',
        workDuration: 15,
        shortBreak: 3,
        longBreak: 10,
      },
      {
        name: 'Deep Work',
        workDuration: 90,
        shortBreak: 15,
        longBreak: 30,
      },
    ];

    for (const preset of presets) {
      await prisma.customPreset.create({
        data: {
          userId: user.id,
          ...preset,
        },
      });
      console.log(`Preset "${preset.name}" created`);
    }

    console.log('\n✅ Test user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();

