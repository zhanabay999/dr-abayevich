import { pgTable, text, serial, integer, timestamp, boolean, varchar, date, time, pgEnum } from 'drizzle-orm/pg-core';

// === Enums ===

export const userRoleEnum = pgEnum('user_role', ['superadmin', 'doctor', 'receptionist', 'assistant']);
export const genderEnum = pgEnum('gender', ['male', 'female']);
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
]);

// === Администраторы (legacy, сохраняем для совместимости) ===
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === Пользователи CRM (с ролями) ===
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  role: userRoleEnum('role').notNull().default('receptionist'),
  doctorId: integer('doctor_id'),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Услуги
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  fullDescription: text('full_description'),
  priceFrom: integer('price_from'),
  priceTo: integer('price_to'),
  image: text('image'),
  category: varchar('category', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Врачи
export const doctors = pgTable('doctors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  specialization: varchar('specialization', { length: 255 }).notNull(),
  experience: integer('experience').notNull(),
  education: text('education'),
  photo: text('photo'),
  bio: text('bio'),
  workPhone: varchar('work_phone', { length: 50 }),
  personalPhone: varchar('personal_phone', { length: 50 }),
  color: varchar('color', { length: 20 }).default('#3B82F6'),
  slotDuration: integer('slot_duration').default(30),
  isActive: boolean('is_active').default(true).notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Отзывы
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  service: varchar('service', { length: 255 }),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Подписчики на рассылку
export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Записи на прием
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  serviceId: integer('service_id'),
  doctorId: integer('doctor_id'),
  preferredDate: varchar('preferred_date', { length: 100 }),
  preferredTime: varchar('preferred_time', { length: 100 }),
  message: text('message'),
  status: varchar('status', { length: 50 }).default('new').notNull(), // new, confirmed, cancelled, completed
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Email кампании для рассылок
export const emailCampaigns = pgTable('email_campaigns', {
  id: serial('id').primaryKey(),
  subject: varchar('subject', { length: 255 }).notNull(),
  content: text('content').notNull(),
  sentAt: timestamp('sent_at'),
  recipientCount: integer('recipient_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// === CRM: Пациенты ===
export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  iin: varchar('iin', { length: 12 }).unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  middleName: varchar('middle_name', { length: 100 }),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  dateOfBirth: date('date_of_birth'),
  gender: genderEnum('gender'),
  address: text('address'),
  insuranceNumber: varchar('insurance_number', { length: 100 }),
  insuranceCompany: varchar('insurance_company', { length: 255 }),
  notes: text('notes'),
  source: varchar('source', { length: 100 }),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdBy: integer('created_by'),
});

// Контакты пациентов (родственники и т.д.)
export const patientContacts = pgTable('patient_contacts', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  relation: varchar('relation', { length: 100 }),
});

// === CRM: Записи на приём (расширенные) ===
export const crmAppointments = pgTable('crm_appointments', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id').notNull(),
  doctorId: integer('doctor_id').notNull(),
  serviceId: integer('service_id'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: appointmentStatusEnum('status').notNull().default('scheduled'),
  color: varchar('color', { length: 20 }),
  notes: text('notes'),
  cancelReason: text('cancel_reason'),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  createdBy: integer('created_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Расписание врачей (рабочие часы по дням недели)
export const doctorSchedules = pgTable('doctor_schedules', {
  id: serial('id').primaryKey(),
  doctorId: integer('doctor_id').notNull(),
  dayOfWeek: integer('day_of_week').notNull(), // 0=Пн, 6=Вс
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  slotDuration: integer('slot_duration').default(30).notNull(), // минуты
  isActive: boolean('is_active').default(true).notNull(),
});

// Исключения в расписании (выходные, отпуск, изменённые часы)
export const doctorScheduleExceptions = pgTable('doctor_schedule_exceptions', {
  id: serial('id').primaryKey(),
  doctorId: integer('doctor_id').notNull(),
  date: date('date').notNull(),
  isWorking: boolean('is_working').default(false).notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  reason: text('reason'),
});
