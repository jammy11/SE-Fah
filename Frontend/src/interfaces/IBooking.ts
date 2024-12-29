import { RideInterface } from "./IRide";

export interface BookingInterface {
    TicketID?: number;
    Date?: string;
    Time?: string;
    RideID?: number;
    Ride?: RideInterface
}
