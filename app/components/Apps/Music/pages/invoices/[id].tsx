import InvoiceForm from "../../components/invoices/invoice-form";

export default function EditInvoice() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Edit Invoice</h1>
      </div>
      <InvoiceForm
        clients={[]}
        defaultValues={{}}
        existingLineItems={[]}
        isEditing
      />
    </div>
  );
}
