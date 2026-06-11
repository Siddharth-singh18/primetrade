import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User.model';
import { Task } from './models/Task.model';
import { env } from './config/env';

const seed = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    const demoEmail = 'demo@taskflow.com';

    // Check if demo user already exists
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password', salt);

      user = await User.create({
        email: demoEmail,
        password: hashedPassword,
        role: 'user',
      });
      console.log('Demo user created: demo@taskflow.com / password');

      // Create some demo tasks
      await Task.create([
        {
          title: 'Review System Architecture',
          description: 'Analyze the current microservices setup for bottlenecks.',
          status: 'done',
          priority: 'high',
          userId: user._id,
          dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        },
        {
          title: 'Implement JWT Authentication',
          description: 'Add access and refresh tokens using Redis for blacklisting.',
          status: 'in-progress',
          priority: 'high',
          userId: user._id,
        },
        {
          title: 'Create Dashboard UI',
          description: 'Design and build the user dashboard with Next.js and Tailwind CSS.',
          status: 'todo',
          priority: 'medium',
          userId: user._id,
        },
      ]);
      console.log('Demo tasks created.');
    } else {
      console.log('Demo user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
