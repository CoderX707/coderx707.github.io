import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { useLocation } from "wouter";
// import { queryClient, apiRequest } from "../../lib/queryClient";
import { Client, Invoice, LineItem, insertInvoiceSchema, BusinessDetails, businessSchema, InsertLineItem } from "../../shared/schema";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import InvoiceLineItems from "./invoice-line-items";
import PDFTemplate from "./pdf-template";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { invoiceTemplates, type InvoiceTemplate } from "./invoice-templates";
import { Card, CardContent } from "../../components/ui/card";
import cn from 'classnames';

interface InvoiceFormProps {
  clients: Client[];
  defaultValues: Partial<Invoice>;
  existingLineItems?: LineItem[];
  isEditing?: boolean;
}

interface InsertInvoice extends Omit<Invoice, 'id'> {
  issueDate: Date;
  dueDate: Date;
}

const TemplateSelector = ({ selectedTemplate, onSelect }: {selectedTemplate: InvoiceTemplate, onSelect: (template: InvoiceTemplate) => void}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Choose Invoice Template</h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {invoiceTemplates.map((template) => (
        <div 
          key={template.id} 
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelect(template)}
        >
          <Card className={cn(
            "border-2",
            selectedTemplate.id === template.id
              ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
              : "hover:border-primary/50"
          )}>
            <CardContent className="p-4 text-center">
              <div className="aspect-video mb-2 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-2xl font-bold">{template.name[0]}</div>
              </div>
              <div className="font-medium">{template.name}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  </div>
);

export default function InvoiceForm({
  clients,
  defaultValues,
  existingLineItems = [],
  isEditing = false,
}: InvoiceFormProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>(existingLineItems);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>(invoiceTemplates[0]);

  // Load business details from localStorage or use defaults
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>(() => {
    const saved = localStorage.getItem('businessDetails');
    return saved ? JSON.parse(saved) : {
      name: '',
      logo: '',
      address: '',
      phone: '',
      email: '',
      taxId: '',
      taxRate: 0
    };
  });

  const form = useForm<InsertInvoice>({
    resolver: zodResolver(insertInvoiceSchema),
    defaultValues: {
      ...defaultValues,
      issueDate: defaultValues.issueDate ? new Date(defaultValues.issueDate) : new Date(),
      dueDate: defaultValues.dueDate ? new Date(defaultValues.dueDate) : new Date(),
      notes: defaultValues.notes || '',
      businessDetails: JSON.stringify(businessDetails)
    },
  });

  const businessForm = useForm<BusinessDetails>({
    resolver: zodResolver(businessSchema),
    defaultValues: businessDetails
  });

  const onSubmit = form.handleSubmit((data) => {
    const total = lineItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2);
    console.log({ 
      ...data, 
      total,
      businessDetails: JSON.stringify(businessDetails)
    });
  });

  const onSaveBusinessDetails = businessForm.handleSubmit((data) => {
    setBusinessDetails(data);
    localStorage.setItem('businessDetails', JSON.stringify(data));
    setShowBusinessDetails(false);
   
  });

  const onGeneratePDF = () => {
    const invoice = form.getValues();
    const selectedClient = clients.find(c => c.id === Number(invoice.clientId));
    if (!selectedClient) return;

    PDFTemplate.generate({
      invoice: { 
        ...invoice, 
        total: lineItems.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2),
        businessDetails: JSON.stringify(businessDetails)
      },
      client: selectedClient,
      lineItems,
      businessDetails,
      template: selectedTemplate
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice Details</h2>
        <Dialog open={showBusinessDetails} onOpenChange={setShowBusinessDetails}>
          <DialogTrigger asChild>
            <Button variant="outline">Business Details</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Business Details</DialogTitle>
            </DialogHeader>
            <Form {...businessForm}>
              <form onSubmit={onSaveBusinessDetails} className="space-y-4">
                <FormField
                  control={businessForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={businessForm.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          step="0.01" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Save Business Details</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <TemplateSelector 
        selectedTemplate={selectedTemplate} 
        onSelect={setSelectedTemplate} 
      />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field}
                      value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <InvoiceLineItems
            items={lineItems}
            onChange={setLineItems}
            invoiceId={defaultValues.id}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onGeneratePDF}
            >
              Generate PDF
            </Button>
            <Button type="submit" disabled={false}>
              {isEditing ? "Update" : "Create"} Invoice
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}