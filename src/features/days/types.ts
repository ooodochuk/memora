import type { DayActivityType } from "@/types";

/** Backend day contract */
export interface DayDto {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  title?: string;
  summary?: string;
  coverImageUrl?: string;
  activities: DayActivityType[];
}

export interface CreateDayRequestDto {
  date: string;
  title?: string;
  summary?: string;
  coverImageUrl?: string;
  activities?: DayActivityType[];
}

export type UpdateDayRequestDto = Partial<CreateDayRequestDto>;
