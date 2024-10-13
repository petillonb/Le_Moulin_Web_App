import { Identite } from "./identite.entite";

export interface Participant {
    id: any;
    idendite_id: Identite;
    event_id: Event;
    presence: any;
  }