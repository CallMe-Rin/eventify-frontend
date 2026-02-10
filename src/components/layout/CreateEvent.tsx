import { useRef, useState } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type CreateEventModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateEvent({
  open,
  onOpenChange,
}: CreateEventModalProps) {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [banner, setBanner] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#faf8f5] p-0">
        {/* ===== HEADER ===== */}
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-lg font-semibold">
            Buat Event
          </DialogTitle>
        </DialogHeader>

        {/* ===== CONTENT ===== */}
        <div className="max-h-[70vh] overflow-y-auto px-6 pb-6 space-y-8">
          {/* Banner Upload */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="flex h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-center hover:bg-muted/30"
              >
                {banner ? (
                  <img
                    src={banner}
                    alt="Banner"
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500 text-orange-500">
                      <Plus />
                    </div>
                    <p className="mt-4 text-base font-medium">
                      Upload image/poster/banner
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Recommended 1200 x 200px and no more than 2Mb
                    </p>
                  </>
                )}

                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setBanner(
                      e.target.files?.[0]
                        ? URL.createObjectURL(e.target.files[0])
                        : null,
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Form */}
          <Card className="w-fullshadow-sm">
            <CardContent className="space-y-3 p-6">
              <Label>Title</Label>
              <Input placeholder="Title" />
            </CardContent>
            <CardContent className="space-y-3 p-6">
              <Label>Location</Label>
              <Input placeholder="Jakarta" />
            </CardContent>
            <CardContent className="space-y-3 p-6">
              <Label>Vanue</Label>
              <Input placeholder="Venue" />
            </CardContent>
            <CardContent className="space-y-3 p-6">
              <Label>Categories</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Take Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sport">TECHNOLOGY</SelectItem>
                  <SelectItem value="Sport">MUSIC</SelectItem>
                  <SelectItem value="Sport">BUSINESS</SelectItem>
                  <SelectItem value="Sport">HEALTH</SelectItem>
                  <SelectItem value="Sport">FOOD</SelectItem>
                  <SelectItem value="Sport">ART</SelectItem>
                  <SelectItem value="Sport">SPORTS</SelectItem>
                  <SelectItem value="Sport">EDUCATION</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>

            <CardContent className="space-y-3 p-6">
              <Label>Date</Label>
              <Input type="date" placeholder="Venue" />
            </CardContent>
          </Card>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
