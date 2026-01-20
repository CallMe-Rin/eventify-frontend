import { Card } from "@/components/ui/card";
import { CreditCard, Landmark, Wallet, Clock, QrCode } from "lucide-react";
import type { PaymentMethod } from "@/types/checkout";

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "credit-card",
    label: "Credit Card",
    description: "Visa, Mastercard, or Amex",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "virtual-account",
    label: "Virtual Account",
    description: "Bank transfer via virtual account",
    icon: <Landmark className="w-5 h-5" />,
  },
  {
    id: "wallet",
    label: "E-Wallet",
    description: "OVO, Dana, GoPay, LinkAja",
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    id: "paylater",
    label: "Pay Later",
    description: "Kredivo, Akulaku, Cicilan 0%",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "qris",
    label: "QRIS",
    description: "Scan QR code to pay",
    icon: <QrCode className="w-5 h-5" />,
  },
];

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
  selectedMethod,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose your preferred payment method
        </p>
      </div>

      <div className="space-y-3">
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            onClick={() => onChange(method.id)}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedMethod === method.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id={method.id}
                name="payment-method"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onChange(method.id)}
                className="mt-1 cursor-pointer"
              />
              <label htmlFor={method.id} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  {method.icon}
                  <span className="font-medium text-sm">{method.label}</span>
                </div>
                <p className="text-xs text-gray-600">{method.description}</p>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Virtual accounts offer the most flexibility
          and security for online purchases.
        </p>
      </div>
    </Card>
  );
}
