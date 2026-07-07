import { switzerlandBikepackingEvents } from "./switzerland-bikepacking";
import { portugalActiveEvents } from "./portugal-active";
import { carpathiansHikingEvents } from "./carpathians-hiking";
import { faroeIslandsEvents } from "./faroe-islands";

export const tripEvents = [
 ...switzerlandBikepackingEvents,
 ...portugalActiveEvents,
 ...carpathiansHikingEvents,
 ...faroeIslandsEvents,
];

export {
 switzerlandBikepackingEvents,
 portugalActiveEvents,
 carpathiansHikingEvents,
 faroeIslandsEvents,
};
