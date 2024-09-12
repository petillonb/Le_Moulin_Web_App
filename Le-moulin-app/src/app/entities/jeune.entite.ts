import { Famille } from "./famille.entite";
import { Identite } from "./identite.entite";


export interface Jeune {
    identite: Identite;
    scholarise: boolean;
    ecole: string;
    classe: string;
    prof: Identite;
    famille: Famille;
   
  }