import { useState } from "react";
import { LineItem, InsertLineItem } from "../../shared/schema";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Trash2 } from "lucide-react";

interface LineItemsProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  invoiceId?: number;
}

export default function InvoiceLineItems({
  items,
  onChange,
  invoiceId,
}: LineItemsProps) {
  const [newItem, setNewItem] = useState<Partial<InsertLineItem>>({
    description: "",
    quantity: 1,
    unitPrice: "0",
    amount: "0",
    invoiceId: invoiceId || 0,
  });

  const calculateAmount = (quantity: number, unitPrice: string) => {
    return (quantity * parseFloat(unitPrice || "0")).toFixed(2);
  };

  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission

    if (!newItem.description || !newItem.quantity || !newItem.unitPrice) {
      return;
    }

    const amount = calculateAmount(Number(newItem.quantity), newItem.unitPrice);
    const item: LineItem = {
      id: Date.now(), // Use timestamp as temporary ID
      description: newItem.description,
      quantity: Number(newItem.quantity),
      unitPrice: newItem.unitPrice,
      amount,
      invoiceId: invoiceId || 0,
    };

    onChange([...items, item]);

    // Reset form
    setNewItem({
      description: "",
      quantity: 1,
      unitPrice: "0",
      amount: "0",
      invoiceId: invoiceId || 0,
    });
  };

  const handleRemoveItem = (itemToRemove: LineItem) => {
    onChange(items.filter(item => item.id !== itemToRemove.id));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Line Items</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="w-24">Quantity</TableHead>
            <TableHead className="w-32">Unit Price</TableHead>
            <TableHead className="w-32">Amount</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.unitPrice}</TableCell>
              <TableCell>${item.amount}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Input
                placeholder="Description"
                value={newItem.description}
                onChange={(e) =>
                  setNewItem({ ...newItem, description: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="1"
                value={newItem.quantity}
                onChange={(e) => {
                  const quantity = parseInt(e.target.value) || 1;
                  const amount = calculateAmount(quantity, newItem.unitPrice || "0");
                  setNewItem({
                    ...newItem,
                    quantity,
                    amount,
                  });
                }}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => {
                  const unitPrice = e.target.value;
                  const amount = calculateAmount(Number(newItem.quantity), unitPrice);
                  setNewItem({
                    ...newItem,
                    unitPrice,
                    amount,
                  });
                }}
              />
            </TableCell>
            <TableCell>
              ${calculateAmount(
                Number(newItem.quantity),
                newItem.unitPrice || "0"
              )}
            </TableCell>
            <TableCell>
              <Button 
                onClick={handleAddItem}
                size="sm"
                type="button" // Explicitly set type to button
              >
                Add
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex justify-end text-lg font-semibold">
        Total: ${items.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
      </div>
    </div>
  );
}