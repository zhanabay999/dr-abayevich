import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from '../lib/db';
import { admins } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

async function initAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.insert(admins).values({
      email: 'admin@dr-abayevich.kz',
      password: hashedPassword,
      name: 'Администратор',
    });

    console.log('✓ Админ создан успешно!');
    console.log('Email: admin@dr-abayevich.kz');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Ошибка при создании админа:', error);
  }
}

initAdmin();
