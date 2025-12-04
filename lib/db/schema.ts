import { pgTable, text, serial, integer, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';

// Администраторы
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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
