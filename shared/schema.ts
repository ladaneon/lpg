import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects table for saving landing pages
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  elements: jsonb("elements").notNull().default('[]'),
  globalStyles: jsonb("global_styles").notNull().default('{}'),
  settings: jsonb("settings").notNull().default('{}'),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

// Templates table for pre-built landing page templates
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  previewImage: text("preview_image"),
  elements: jsonb("elements").notNull().default('[]'),
  globalStyles: jsonb("global_styles").notNull().default('{}'),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

// Assets table for uploaded images and files
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: text("size").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

// Element schema for individual page elements
export const elementSchema = z.object({
  id: z.string(),
  type: z.enum([
    // Basic Elements
    'text', 'heading', 'image', 'button', 'video', 'spacer',
    // Layout Elements  
    'section', 'row', 'column', 'container', 'grid', 'flex',
    // Content Elements
    'gallery', 'slider', 'carousel', 'hero', 'feature-box', 'icon-box',
    'testimonial', 'review', 'stats', 'counter', 'progress-bar',
    // Interactive Elements
    'accordion', 'tabs', 'modal', 'tooltip', 'dropdown', 'search-box',
    'rating', 'toggle', 'switch', 'timeline',
    // Form Elements
    'contact-form', 'newsletter', 'input', 'textarea', 'select', 'checkbox',
    'radio', 'file-upload', 'form-button', 'form-group',
    // Navigation Elements
    'navbar', 'menu', 'breadcrumb', 'pagination', 'sidebar',
    // Media Elements
    'audio', 'embed', 'iframe', 'code-block', 'syntax-highlight',
    // Social & Communication
    'social', 'share-buttons', 'comments', 'chat-widget', 'messenger',
    // Business Elements
    'pricing', 'pricing-table', 'team-member', 'about-card', 'service-card',
    'product-card', 'blog-card', 'event-card', 'portfolio-item',
    // Utility Elements
    'map', 'weather-widget', 'calendar', 'clock', 'countdown',
    'notification', 'alert', 'badge', 'label', 'divider', 'separator'
  ]),
  content: z.record(z.any()).default({}),
  styles: z.record(z.any()).default({}),
  settings: z.record(z.any()).default({}),
  children: z.array(z.string()).default([]),
  parentId: z.string().optional(),
  order: z.number().default(0),
});

// Global styles schema
export const globalStylesSchema = z.object({
  colors: z.object({
    primary: z.string().default('#2563eb'),
    secondary: z.string().default('#64748b'),
    accent: z.string().default('#7c3aed'),
    background: z.string().default('#ffffff'),
    foreground: z.string().default('#0f172a'),
  }).default({}),
  fonts: z.object({
    primary: z.string().default('Inter'),
    secondary: z.string().default('Georgia'),
    mono: z.string().default('Menlo'),
  }).default({}),
  spacing: z.object({
    scale: z.number().default(1),
    unit: z.string().default('rem'),
  }).default({}),
});

// Project settings schema
export const projectSettingsSchema = z.object({
  responsive: z.object({
    breakpoints: z.object({
      mobile: z.number().default(768),
      tablet: z.number().default(1024),
      desktop: z.number().default(1200),
    }),
  }).default(() => ({
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1200,
    }
  })),
  seo: z.object({
    title: z.string().default(''),
    description: z.string().default(''),
    keywords: z.string().default(''),
  }).default({}),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type Project = typeof projects.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type Asset = typeof assets.$inferSelect;

export type Element = z.infer<typeof elementSchema>;
export type GlobalStyles = z.infer<typeof globalStylesSchema>;
export type ProjectSettings = z.infer<typeof projectSettingsSchema>;
