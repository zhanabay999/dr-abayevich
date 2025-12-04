import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import { db } from '../lib/db';
import { admins } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function initAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dr-abayevich.kz';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('🔧 Инициализация админа...');
    console.log('Email из .env.local:', adminEmail);

    // Удаляем всех существующих админов
    await db.delete(admins);
    console.log('✓ Все старые админы удалены');

    // Создаем нового админа
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.insert(admins).values({
      email: adminEmail,
      password: hashedPassword,
      name: 'Администратор',
    });

    console.log('✓ Админ успешно создан!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 URL: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при создании админа:', error);
    process.exit(1);
  }
}

initAdmin();
