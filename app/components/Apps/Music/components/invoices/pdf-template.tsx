import jsPDF from "jspdf";
import {
  Client,
  Invoice,
  LineItem,
  BusinessDetails,
} from "../../shared/schema";
import type { InvoiceTemplate } from "./invoice-templates";

interface PDFTemplateProps {
  invoice: Invoice;
  client: Client;
  lineItems: LineItem[];
  businessDetails: BusinessDetails;
  template: InvoiceTemplate;
}

type LayoutHandler = (doc: jsPDF, props: PDFTemplateProps) => void;

// Define classic template first
const classicTemplate: LayoutHandler = (
  doc: jsPDF,
  props: PDFTemplateProps
) => {
  const { invoice, client, lineItems, businessDetails } = props;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Traditional header
  if (businessDetails.logo) {
    try {
      doc.addImage(businessDetails.logo, "JPEG", 20, 20, 40, 40);
    } catch (e) {
      console.error("Failed to load logo:", e);
    }
  }

  // Business Details on the left
  const businessStartY = businessDetails.logo ? 70 : 20;
  doc.setFontSize(16);
  doc.text(businessDetails.name || "Your Business Name", 20, businessStartY);
  doc.setFontSize(10);
  doc.text(businessDetails.address || "", 20, businessStartY + 10);
  doc.text(`Phone: ${businessDetails.phone || ""}`, 20, businessStartY + 20);
  doc.text(`Email: ${businessDetails.email || ""}`, 20, businessStartY + 30);
  if (businessDetails.taxId) {
    doc.text(`Tax ID: ${businessDetails.taxId}`, 20, businessStartY + 40);
  }

  // Invoice Title and Details on the right
  doc.setFontSize(24);
  doc.text("INVOICE", pageWidth - 40, businessStartY, { align: "right" });
  doc.setFontSize(12);
  doc.text(
    `Invoice Number: ${invoice.invoiceNumber}`,
    pageWidth - 40,
    businessStartY + 20,
    { align: "right" }
  );
  doc.text(
    `Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`,
    pageWidth - 40,
    businessStartY + 30,
    { align: "right" }
  );
  doc.text(
    `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
    pageWidth - 40,
    businessStartY + 40,
    { align: "right" }
  );
  doc.text(
    `Status: ${invoice.status.toUpperCase()}`,
    pageWidth - 40,
    businessStartY + 50,
    { align: "right" }
  );

  // Client Details
  const clientStartY = businessStartY + 70;
  doc.setFontSize(14);
  doc.text("Bill To:", 20, clientStartY);
  doc.setFontSize(12);
  doc.text(client.name, 20, clientStartY + 10);
  doc.text(client.address, 20, clientStartY + 20);
  doc.text(client.email, 20, clientStartY + 30);
  doc.text(client.phone, 20, clientStartY + 40);

  // Line Items Table
  const tableTop = clientStartY + 60;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, tableTop, pageWidth - 40, 10, "F");

  // Table Headers
  doc.setFontSize(10);
  doc.text("Description", 25, tableTop + 7);
  doc.text("Qty", 120, tableTop + 7);
  doc.text("Unit Price", 140, tableTop + 7);
  doc.text("Amount", pageWidth - 45, tableTop + 7);

  // Table Content
  let yPos = tableTop + 20;
  lineItems.forEach((item) => {
    doc.text(item.description, 25, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(`$${item.unitPrice}`, 140, yPos);
    doc.text(`$${item.amount}`, pageWidth - 45, yPos);
    yPos += 12;
  });

  // Subtotal, Tax, and Total
  const subtotal = lineItems.reduce(
    (sum, item) => sum + parseFloat(item.amount),
    0
  );
  const tax = businessDetails.taxRate
    ? (subtotal * businessDetails.taxRate) / 100
    : 0;
  const total = subtotal + tax;

  yPos += 10;
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  doc.text("Subtotal:", 120, yPos);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 45, yPos);

  if (businessDetails.taxRate) {
    yPos += 12;
    doc.text(`Tax (${businessDetails.taxRate}%):`, 120, yPos);
    doc.text(`$${tax.toFixed(2)}`, pageWidth - 45, yPos);
  }

  yPos += 12;
  doc.setFontSize(12);
  doc.text("Total:", 120, yPos);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 45, yPos);

  // Notes
  if (invoice.notes) {
    yPos += 30;
    doc.setFontSize(11);
    doc.text("Notes:", 20, yPos);
    doc.setFontSize(10);
    doc.text(invoice.notes, 20, yPos + 10);
  }
};

// Now define other templates with proper type annotation
const layoutHandlers: Record<string, LayoutHandler> = {
  modern: (doc: jsPDF, props: PDFTemplateProps) => {
    const { invoice, client, lineItems, businessDetails } = props;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header with gradient background
    doc.setFillColor(240, 240, 250);
    doc.rect(0, 0, pageWidth, 80, "F");

    // Business details on the left
    doc.setFontSize(24);
    doc.setTextColor(50, 50, 50);
    doc.text(businessDetails.name || "Business Name", 20, 30);
    doc.setFontSize(10);
    doc.text(businessDetails.address || "", 20, 40);
    doc.text(`Phone: ${businessDetails.phone || ""}`, 20, 50);
    doc.text(`Email: ${businessDetails.email || ""}`, 20, 60);
    if (businessDetails.taxId) {
      doc.text(`Tax ID: ${businessDetails.taxId}`, 20, 70);
    }

    // Invoice Details on the right
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 40, 30, {
      align: "right",
    });
    doc.text(
      `Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`,
      pageWidth - 40,
      40,
      { align: "right" }
    );
    doc.text(
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      pageWidth - 40,
      50,
      { align: "right" }
    );
    doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 40, 60, {
      align: "right",
    });

    // Client Details
    const clientStartY = 100;
    doc.setFontSize(14);
    doc.text("Bill To:", 20, clientStartY);
    doc.setFontSize(12);
    doc.text(client.name, 20, clientStartY + 10);
    doc.text(client.address, 20, clientStartY + 20);
    doc.text(client.email, 20, clientStartY + 30);
    doc.text(client.phone, 20, clientStartY + 40);

    // Line Items Table
    const tableTop = clientStartY + 60;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, tableTop, pageWidth - 40, 10, "F");

    // Table Headers
    doc.setFontSize(10);
    doc.text("Description", 25, tableTop + 7);
    doc.text("Qty", 120, tableTop + 7);
    doc.text("Unit Price", 140, tableTop + 7);
    doc.text("Amount", pageWidth - 45, tableTop + 7);

    // Table Content
    let yPos = tableTop + 20;
    lineItems.forEach((item) => {
      doc.text(item.description, 25, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.unitPrice}`, 140, yPos);
      doc.text(`$${item.amount}`, pageWidth - 45, yPos);
      yPos += 12;
    });

    // Totals
    const subtotal = lineItems.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    );
    const tax = businessDetails.taxRate
      ? (subtotal * businessDetails.taxRate) / 100
      : 0;
    const total = subtotal + tax;

    yPos += 10;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    doc.text("Subtotal:", 120, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 45, yPos);

    if (businessDetails.taxRate) {
      yPos += 12;
      doc.text(`Tax (${businessDetails.taxRate}%):`, 120, yPos);
      doc.text(`$${tax.toFixed(2)}`, pageWidth - 45, yPos);
    }

    yPos += 12;
    doc.setFontSize(12);
    doc.text("Total:", 120, yPos);
    doc.text(`$${total.toFixed(2)}`, pageWidth - 45, yPos);

    // Notes
    if (invoice.notes) {
      yPos += 30;
      doc.setFontSize(11);
      doc.text("Notes:", 20, yPos);
      doc.setFontSize(10);
      doc.text(invoice.notes, 20, yPos + 10);
    }
  },

  minimal: (doc: jsPDF, props: PDFTemplateProps) => {
    const { invoice, client, lineItems, businessDetails } = props;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Clean, minimal header
    doc.setFontSize(28);
    doc.text("INVOICE", 20, 40);

    // Business details with minimal styling
    doc.setFontSize(10);
    doc.text(businessDetails.name || "", 20, 60);
    doc.text(businessDetails.address || "", 20, 70);
    doc.text(`Phone: ${businessDetails.phone || ""}`, 20, 80);
    doc.text(`Email: ${businessDetails.email || ""}`, 20, 90);
    if (businessDetails.taxId) {
      doc.text(`Tax ID: ${businessDetails.taxId}`, 20, 100);
    }

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`#${invoice.invoiceNumber}`, pageWidth - 40, 60, {
      align: "right",
    });
    doc.text(
      `Issued: ${new Date(invoice.issueDate).toLocaleDateString()}`,
      pageWidth - 40,
      70,
      { align: "right" }
    );
    doc.text(
      `Due: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      pageWidth - 40,
      80,
      { align: "right" }
    );
    doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 40, 90, {
      align: "right",
    });

    // Client Details
    const clientStartY = 120;
    doc.text("Bill To:", 20, clientStartY);
    doc.text(client.name, 20, clientStartY + 10);
    doc.text(client.address, 20, clientStartY + 20);
    doc.text(client.email, 20, clientStartY + 30);
    doc.text(client.phone, 20, clientStartY + 40);

    // Line Items Table
    const tableTop = clientStartY + 60;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, tableTop, pageWidth - 40, 10, "F");

    // Table Headers
    doc.text("Description", 25, tableTop + 7);
    doc.text("Qty", 120, tableTop + 7);
    doc.text("Unit Price", 140, tableTop + 7);
    doc.text("Amount", pageWidth - 45, tableTop + 7);

    // Table Content
    let yPos = tableTop + 20;
    lineItems.forEach((item) => {
      doc.text(item.description, 25, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.unitPrice}`, 140, yPos);
      doc.text(`$${item.amount}`, pageWidth - 45, yPos);
      yPos += 12;
    });

    // Totals
    const subtotal = lineItems.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    );
    const tax = businessDetails.taxRate
      ? (subtotal * businessDetails.taxRate) / 100
      : 0;
    const total = subtotal + tax;

    yPos += 10;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    doc.text("Subtotal:", 120, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 45, yPos);

    if (businessDetails.taxRate) {
      yPos += 12;
      doc.text(`Tax (${businessDetails.taxRate}%):`, 120, yPos);
      doc.text(`$${tax.toFixed(2)}`, pageWidth - 45, yPos);
    }

    yPos += 12;
    doc.setFontSize(12);
    doc.text("Total:", 120, yPos);
    doc.text(`$${total.toFixed(2)}`, pageWidth - 45, yPos);

    // Notes
    if (invoice.notes) {
      yPos += 30;
      doc.setFontSize(10);
      doc.text("Notes:", 20, yPos);
      doc.text(invoice.notes, 20, yPos + 10);
    }
  },

  professional: (doc: jsPDF, props: PDFTemplateProps) => {
    const { invoice, client, lineItems, businessDetails } = props;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Professional header with dark blue background
    doc.setFillColor(20, 40, 80);
    doc.rect(0, 0, pageWidth, 100, "F");
    doc.setTextColor(255, 255, 255);

    // Business details
    doc.setFontSize(24);
    doc.text(businessDetails.name || "Business Name", 20, 40);
    doc.setFontSize(10);
    doc.text(businessDetails.address || "", 20, 55);
    doc.text(`Phone: ${businessDetails.phone || ""}`, 20, 65);
    doc.text(`Email: ${businessDetails.email || ""}`, 20, 75);
    if (businessDetails.taxId) {
      doc.text(`Tax ID: ${businessDetails.taxId}`, 20, 85);
    }

    // Invoice details on the right
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 40, 40, {
      align: "right",
    });
    doc.text(
      `Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`,
      pageWidth - 40,
      55,
      { align: "right" }
    );
    doc.text(
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      pageWidth - 40,
      70,
      { align: "right" }
    );
    doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 40, 85, {
      align: "right",
    });

    // Reset text color for rest of the document
    doc.setTextColor(0, 0, 0);

    // Client Details
    const clientStartY = 120;
    doc.setFontSize(14);
    doc.text("Bill To:", 20, clientStartY);
    doc.setFontSize(12);
    doc.text(client.name, 20, clientStartY + 15);
    doc.text(client.address, 20, clientStartY + 30);
    doc.text(client.email, 20, clientStartY + 45);
    doc.text(client.phone, 20, clientStartY + 60);

    // Line Items Table
    const tableTop = clientStartY + 80;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, tableTop, pageWidth - 40, 10, "F");

    // Table Headers
    doc.setFontSize(10);
    doc.text("Description", 25, tableTop + 7);
    doc.text("Qty", 120, tableTop + 7);
    doc.text("Unit Price", 140, tableTop + 7);
    doc.text("Amount", pageWidth - 45, tableTop + 7);

    // Table Content
    let yPos = tableTop + 20;
    lineItems.forEach((item) => {
      doc.text(item.description, 25, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.unitPrice}`, 140, yPos);
      doc.text(`$${item.amount}`, pageWidth - 45, yPos);
      yPos += 12;
    });

    // Totals
    const subtotal = lineItems.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    );
    const tax = businessDetails.taxRate
      ? (subtotal * businessDetails.taxRate) / 100
      : 0;
    const total = subtotal + tax;

    yPos += 10;
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    doc.text("Subtotal:", 120, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 45, yPos);

    if (businessDetails.taxRate) {
      yPos += 12;
      doc.text(`Tax (${businessDetails.taxRate}%):`, 120, yPos);
      doc.text(`$${tax.toFixed(2)}`, pageWidth - 45, yPos);
    }

    yPos += 12;
    doc.setFontSize(12);
    doc.text("Total:", 120, yPos);
    doc.text(`$${total.toFixed(2)}`, pageWidth - 45, yPos);

    // Notes
    if (invoice.notes) {
      yPos += 30;
      doc.setFontSize(11);
      doc.text("Notes:", 20, yPos);
      doc.setFontSize(10);
      doc.text(invoice.notes, 20, yPos + 10);
    }
  },

  creative: (doc: jsPDF, props: PDFTemplateProps) => {
    const { invoice, client, lineItems, businessDetails } = props;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Creative header with accent elements
    doc.setFillColor(255, 200, 200);
    doc.circle(pageWidth - 40, 40, 30, "F");

    // Business details with creative styling
    doc.setFontSize(28);
    doc.text(businessDetails.name || "Business Name", 20, 40);
    doc.setFontSize(10);
    doc.text(businessDetails.address || "", 20, 55);
    doc.text(`Phone: ${businessDetails.phone || ""}`, 20, 65);
    doc.text(`Email: ${businessDetails.email || ""}`, 20, 75);
    if (businessDetails.taxId) {
      doc.text(`Tax ID: ${businessDetails.taxId}`, 20, 85);
    }

    // Invoice details with creative positioning
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 80, 40);
    doc.text(
      `Issued: ${new Date(invoice.issueDate).toLocaleDateString()}`,
      pageWidth - 80,
      55
    );
    doc.text(
      `Due: ${new Date(invoice.dueDate).toLocaleDateString()}`,
      pageWidth - 80,
      70
    );
    doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 80, 85);

    // Client Details with decorative element
    const clientStartY = 120;
    doc.setFillColor(255, 220, 220);
    doc.rect(15, clientStartY - 5, 5, 80, "F");

    doc.setFontSize(14);
    doc.text("Bill To:", 30, clientStartY);
    doc.setFontSize(12);
    doc.text(client.name, 30, clientStartY + 15);
    doc.text(client.address, 30, clientStartY + 30);
    doc.text(client.email, 30, clientStartY + 45);
    doc.text(client.phone, 30, clientStartY + 60);

    // Line Items Table with styled header
    const tableTop = clientStartY + 80;
    doc.setFillColor(255, 240, 240);
    doc.rect(20, tableTop, pageWidth - 40, 10, "F");

    // Table Headers
    doc.setFontSize(10);
    doc.text("Description", 25, tableTop + 7);
    doc.text("Qty", 120, tableTop + 7);
    doc.text("Unit Price", 140, tableTop + 7);
    doc.text("Amount", pageWidth - 45, tableTop + 7);

    // Table Content
    let yPos = tableTop + 20;
    lineItems.forEach((item) => {
      doc.text(item.description, 25, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.unitPrice}`, 140, yPos);
      doc.text(`$${item.amount}`, pageWidth - 45, yPos);
      yPos += 12;
    });

    // Totals with decorative elements
    const subtotal = lineItems.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    );
    const tax = businessDetails.taxRate
      ? (subtotal * businessDetails.taxRate) / 100
      : 0;
    const total = subtotal + tax;

    yPos += 10;
    doc.setDrawColor(255, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;

    doc.text("Subtotal:", 120, yPos);
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 45, yPos);

    if (businessDetails.taxRate) {
      yPos += 12;
      doc.text(`Tax (${businessDetails.taxRate}%):`, 120, yPos);
      doc.text(`$${tax.toFixed(2)}`, pageWidth - 45, yPos);
    }

    yPos += 12;
    doc.setFontSize(12);
    doc.text("Total:", 120, yPos);
    doc.text(`$${total.toFixed(2)}`, pageWidth - 45, yPos);

    // Notes with creative styling
    if (invoice.notes) {
      yPos += 30;
      doc.setFillColor(255, 240, 240);
      doc.rect(15, yPos - 5, 5, 40, "F");
      doc.setFontSize(11);
      doc.text("Notes:", 30, yPos);
      doc.setFontSize(10);
      doc.text(invoice.notes, 30, yPos + 10);
    }
  },

  classic: classicTemplate, // Reference the pre-defined classic template
};

const PDFTemplate = {
  generate: (props: PDFTemplateProps) => {
    const doc = new jsPDF();
    const layoutHandler = layoutHandlers[props.template.layout];
    if (layoutHandler) {
      layoutHandler(doc, props);
    } else {
      console.error("Invalid template layout selected.");
    }
    doc.save(`invoice-${props.invoice.invoiceNumber}.pdf`);
  },
};

export default PDFTemplate;
