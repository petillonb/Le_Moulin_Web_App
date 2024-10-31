import { Identite } from "./identite.entite";
import { activiteEvent } from "./event.entite";

export interface Participant {
    id: any;
    identite_id: Identite;
    event_id: activiteEvent;
    present: any;
  }