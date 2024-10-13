import { Activite } from "./activite.entite";
import { Identite } from "./identite.entite";
import { Participant } from "./participant.entite";

export interface Event {
    id: any;
    activite_id: Activite;
    date: any;
  }