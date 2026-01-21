import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AttendeeInfo } from "@/types/checkout";
import { CircleAlert } from "lucide-react";

interface AttendeeFormProps {
  attendeeInfo: AttendeeInfo;
  onUpdate: (info: Partial<AttendeeInfo>) => void;
  errors?: Partial<Record<keyof AttendeeInfo, string>>;
}

export function AttendeeForm({
  attendeeInfo,
  onUpdate,
  errors = {},
}: AttendeeFormProps) {
  return (
    <Card className="p-6 space-y-1">
      <div>
        <h3 className="font-semibold text-lg mt-1">Attendee Information</h3>
        <p className="text-sm text-secondary-foreground mt-1 mb-0">
          Please provide your details for the ticket
        </p>
      </div>

      <Separator />

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          value={attendeeInfo.fullName}
          onChange={(e) => onUpdate({ fullName: e.target.value })}
          className={errors.fullName ? "border-destructive" : ""}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={attendeeInfo.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">
          Phone Number <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter your phone number (with country code)"
          value={attendeeInfo.phoneNumber}
          onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
          className={errors.phoneNumber ? "border-destructive" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-destructive">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-primary/10 border-primary/10 border rounded-lg p-4 flex flex-row gap-2 items-center justify-left mb-2">
        <span>
          <CircleAlert className="h-5 w-5 text-primary" />
        </span>
        <p className="text-xs text-primary">
          These details will be used for your event ticket and communication
          from the organizer.
        </p>
      </div>
    </Card>
  );
}
