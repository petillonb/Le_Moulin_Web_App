import { Identite } from "./identite.entite";
import { EventActivite } from "./event.entite";

export interface Participant {
    id: any;
    identite_id: Identite;
    event_id: EventActivite;
    present: any;
  }