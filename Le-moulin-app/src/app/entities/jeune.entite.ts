import { Famille } from "./famille.entite";
import { Identite } from "./identite.entite";


export interface Jeune {

    id:any;
    identite_id: Identite;
    scholarite: any;
    scholarite_france: any;
    accompagnateurA_id: Identite;
    accompagnateurB_id: Identite;
    urgenceA_id: Identite;
    urgenceB_id: Identite;
    autorisation_photo: any;
    autorisation_medical: any;
    autorisation_sortie: any;
    ecole: any;
    classe: any;
    prof_principale_id: Identite;
    famille_id: Famille;
   
  }