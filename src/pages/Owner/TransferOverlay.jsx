import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Loader2, X, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  approveTransfer,
  rejectTransfer,
} from "@/feautures/transfer/transferService";
import { getLocations } from "@/feautures/branches/branchService";
export default function TransferOverlay({
  transferId,
  transfers,
  products,
  onClose,
  onRefresh,
}) {
  const transfer = transfers.find((t) => t.id === transferId);
  const [locations, setLocations] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState(
    () =>
      transfer?.items?.reduce((acc, item) => {
        acc[item.product_id] = { quantity: item.quantity, approved: true };
        return acc;
      }, {}) || {},
  );

  useEffect(() => {
    getLocations().then((data) =>
      setLocations(data.filter((l) => l.id !== transfer?.to_location_id)),
    );
  }, [transfer]);

  const handleSubmit = async () => {
    const decisions = Object.entries(selectedItems).map(([id, val]) => ({
      product_id: id,
      approved: val.approved,
      quantity: val.quantity,
    }));
    const allRejected = decisions.every((i) => !i.approved);
    if (!selectedSource && !allRejected)
      return toast.error("Select Source Branch");

    setIsSubmitting(true);
    try {
      if (allRejected) await rejectTransfer(transferId);
      else await approveTransfer(transferId, decisions, selectedSource);
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transfer) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4 z-50">
      <Card className="max-w-2xl w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Transfer Review</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Origin Branch..." />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfer.items?.map((item) => {
                  const p = products.find(
                    (prod) => prod.id === item.product_id,
                  );
                  const state = selectedItems[item.product_id];
                  return (
                    <TableRow
                      key={item.product_id}
                      className={!state?.approved ? "opacity-30" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={p?.image_url}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <p className="text-xs font-bold line-clamp-1">
                            {p?.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={state?.quantity}
                          disabled={!state?.approved}
                          onChange={(e) =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.product_id]: {
                                ...prev[item.product_id],
                                quantity: Number(e.target.value),
                              },
                            }))
                          }
                          className="w-16 mx-auto h-8 text-center"
                        />
                      </TableCell>
                      <TableCell className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant={state?.approved ? "default" : "outline"}
                          className="h-8 w-8"
                          onClick={() =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.product_id]: {
                                ...prev[item.product_id],
                                approved: true,
                              },
                            }))
                          }
                        >
                          <CheckCircle2 className="h-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant={!state?.approved ? "destructive" : "outline"}
                          className="h-8 w-8"
                          onClick={() =>
                            setSelectedItems((prev) => ({
                              ...prev,
                              [item.product_id]: {
                                ...prev[item.product_id],
                                approved: false,
                              },
                            }))
                          }
                        >
                          <XCircle className="h-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <Button
            className="w-full h-12 font-bold"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Confirm Transfer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
