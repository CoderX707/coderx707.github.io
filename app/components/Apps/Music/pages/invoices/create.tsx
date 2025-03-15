import { Client } from "../../shared/schema";
import InvoiceForm from "../../components/invoices/invoice-form";
import { useState } from "react";

export default function CreateInvoice() {
  const [clients, setClients] = useState<Client[]>([]);

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
      </div>

      <InvoiceForm
        clients={clients}
        defaultValues={{
          invoiceNumber: `INV-${Date.now()}`,
          clientId: 0,
          issueDate: new Date(),
          dueDate: new Date(),
          status: "pending",
          total: "0",
          notes: "",
          businessDetails: "{}",
        }}
      />
    </>
  );
}
