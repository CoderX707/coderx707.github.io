import { Client, Invoice, LineItem } from "@shared/schema";

const STORAGE_KEYS = {
  CLIENTS: "invoice_app_clients",
  INVOICES: "invoice_app_invoices",
  LINE_ITEMS: "invoice_app_line_items"
};

export function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function syncClients(clients: Client[]) {
  saveToStorage(STORAGE_KEYS.CLIENTS, clients);
}

export function syncInvoices(invoices: Invoice[]) {
  saveToStorage(STORAGE_KEYS.INVOICES, invoices);
}

export function syncLineItems(lineItems: LineItem[]) {
  saveToStorage(STORAGE_KEYS.LINE_ITEMS, lineItems);
}

export function loadInitialData() {
  return {
    clients: loadFromStorage<Client[]>(STORAGE_KEYS.CLIENTS) || [],
    invoices: loadFromStorage<Invoice[]>(STORAGE_KEYS.INVOICES) || [],
    lineItems: loadFromStorage<LineItem[]>(STORAGE_KEYS.LINE_ITEMS) || []
  };
}
