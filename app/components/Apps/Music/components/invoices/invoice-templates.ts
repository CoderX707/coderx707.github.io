export type InvoiceTemplate = {
  id: number;
  name: string;
  description: string;
  preview: string; // URL to template preview image
  layout: 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';
};

export const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: 1,
    name: "Modern",
    description: "Clean and contemporary design with a focus on typography",
    preview: "/templates/modern.svg",
    layout: "modern"
  },
  {
    id: 2,
    name: "Classic",
    description: "Traditional business invoice layout",
    preview: "/templates/classic.svg",
    layout: "classic"
  },
  {
    id: 3,
    name: "Minimal",
    description: "Simple and elegant design with essential information",
    preview: "/templates/minimal.svg",
    layout: "minimal"
  },
  {
    id: 4,
    name: "Professional",
    description: "Formal design suitable for corporate use",
    preview: "/templates/professional.svg",
    layout: "professional"
  },
  {
    id: 5,
    name: "Creative",
    description: "Unique design with creative elements",
    preview: "/templates/creative.svg",
    layout: "creative"
  }
];
