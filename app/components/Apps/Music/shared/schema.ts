import { pgTable, text, serial, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Business Settings Schema
export const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  logo: z.string().optional(),
  address: z.string().min(1, "Business address is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  taxId: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull()
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull(),
  clientId: integer("client_id").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull(), // pending, paid, overdue
  total: decimal("total").notNull(),
  notes: text("notes").default(''),
  businessDetails: text("business_details").default('{}')
});

export const lineItems = pgTable("line_items", {
  id: serial("id").primaryKey(),
  invoiceId: integer("invoice_id").notNull(),
  description: text("description").notNull(),  
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price").notNull(),
  amount: decimal("amount").notNull()
});

// Custom Zod schema for dates
const dateSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  return arg;
}, z.date());

// Create base schemas
const baseClientSchema = createInsertSchema(clients);
const baseInvoiceSchema = createInsertSchema(invoices);
const baseLineItemSchema = createInsertSchema(lineItems);

// Export modified schemas
export const insertClientSchema = baseClientSchema.omit({ id: true });

export const insertInvoiceSchema = baseInvoiceSchema.omit({ id: true }).extend({
  issueDate: dateSchema,
  dueDate: dateSchema,
  notes: z.string().optional().default(''),
  businessDetails: z.string().optional().default('{}')
});

export const insertLineItemSchema = baseLineItemSchema.omit({ id: true });

// Export types
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type LineItem = typeof lineItems.$inferSelect;
export type InsertLineItem = z.infer<typeof insertLineItemSchema>;

export type BusinessDetails = z.infer<typeof businessSchema>;