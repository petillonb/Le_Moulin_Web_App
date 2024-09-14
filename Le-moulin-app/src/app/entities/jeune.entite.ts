import { Famille } from "./famille.entite";
import { Identite } from "./identite.entite";


export interface Jeune {

    id:number;
    identite_id: Identite;
    scholarise: boolean;
    ecole: string;
    classe: string;
    prof_principale_id: Identite;
    famille_id: Famille;
   
  }