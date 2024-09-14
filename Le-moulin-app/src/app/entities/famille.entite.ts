import { Identite } from "./identite.entite";

export interface Famille{
  id:number;
  nom:string;
  parentA_id:Identite;
  parentB_id:Identite;
}
