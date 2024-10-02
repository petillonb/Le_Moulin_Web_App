import { Identite } from "./identite.entite";

export interface Famille{
  id:any;
  nom:any;
  parentA_id:Identite;
  parentB_id:Identite;
}
