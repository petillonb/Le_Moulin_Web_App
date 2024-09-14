import { Contact } from "./contact.entite";


export interface Identite{
  id:number;
  prenom: string;
  nom: string;
  date_naissance: Date;
  nationalite: string;
  genre: string;
  contact_id:Contact;
}

