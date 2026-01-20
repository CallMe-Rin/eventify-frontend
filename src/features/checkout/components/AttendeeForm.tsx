import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AttendeeInfo } from "@/types/checkout";

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
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Attendee Information</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please provide your details for the ticket
        </p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          value={attendeeInfo.fullName}
          onChange={(e) => onUpdate({ fullName: e.target.value })}
          className={errors.fullName ? "border-red-500" : ""}
        />
        {errors.fullName && (
          <p className="text-xs text-red-600">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={attendeeInfo.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-sm font-medium">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter your phone number (with country code)"
          value={attendeeInfo.phoneNumber}
          onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-red-600">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700">
          ℹ️ These details will be used for your event ticket and communication
          from the organizer.
        </p>
      </div>
    </Card>
  );
}
