"use client";

import { useLocale, useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/routing";
import { useAdventureStatuses } from "@/features/reference/hooks";
import {
  getReferenceStatusLabel,
  referenceCodeToTripStatus,
  tripStatusToReferenceCode,
} from "@/lib/reference/adventure-status";
import type { TripStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdventureStatusSelectProps {
  id?: string;
  value: TripStatus | string;
  onValueChange: (value: TripStatus) => void;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

export function AdventureStatusSelect({
  id,
  value,
  onValueChange,
  disabled,
  "aria-invalid": ariaInvalid,
}: AdventureStatusSelectProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("dashboard.tripForm.fields.status");
  const statusesQuery = useAdventureStatuses();

  const options =
    statusesQuery.data?.map((item) => ({
      code: item.code,
      status: referenceCodeToTripStatus(item.code),
      label: getReferenceStatusLabel(item, locale),
    })) ?? [];

  const selectedCode = tripStatusToReferenceCode(value);

  return (
    <Select
      value={selectedCode}
      onValueChange={(code) => {
        if (code) onValueChange(referenceCodeToTripStatus(code));
      }}
      disabled={disabled || statusesQuery.isLoading}
    >
      <SelectTrigger
        id={id}
        className="h-11 w-full rounded-xl sm:h-10"
        aria-invalid={ariaInvalid}
      >
        <SelectValue placeholder={t("placeholder")} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.code} value={option.code}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
