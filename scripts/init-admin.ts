import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import bcrypt from 'bcryptjs';

async function initAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dr-abayevich.kz';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('🔧 Инициализация суперадмина...');
    console.log('Email из .env.local:', adminEmail);

    // Удаляем всех существующих пользователей
    await db.delete(users);
    console.log('✓ Все старые пользователи удалены');

    // Создаем суперадмина
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.insert(users).values({
      email: adminEmail,
      password: hashedPassword,
      name: 'Администратор',
      role: 'superadmin',
      isActive: true,
    });

    console.log('✓ Суперадмин успешно создан!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Роль: superadmin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 CRM: http://localhost:3000/crm');
    console.log('🌐 Admin: http://localhost:3000/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при создании админа:', error);
    process.exit(1);
  }
}

initAdmin();
