import { Contact } from "./contact.entite";


export interface Identite{
  id:any;
  prenom: any;
  nom: any;
  date_naissance: any;
  nationalite: any;
  genre: any;
  contact_id:Contact;
}

