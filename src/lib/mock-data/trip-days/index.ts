import { switzerlandBikepackingDays } from "./switzerland-bikepacking";
import { portugalActiveDays } from "./portugal-active";
import { carpathiansHikingDays } from "./carpathians-hiking";
import { faroeIslandsDays } from "./faroe-islands";

export const tripDays = [
 ...switzerlandBikepackingDays,
 ...portugalActiveDays,
 ...carpathiansHikingDays,
 ...faroeIslandsDays,
];

export {
 switzerlandBikepackingDays,
 portugalActiveDays,
 carpathiansHikingDays,
 faroeIslandsDays,
};
