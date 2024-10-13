import { Injectable } from '@angular/core'
import { Form } from '@angular/forms'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  QueryData,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '../../../environment'
import { Activite } from '../../entities/activite.entite'
import { Jeune } from '../../entities/jeune.entite'
import { Identite } from '../../entities/identite.entite'
import { Contact } from '../../entities/contact.entite'
import { Famille } from '../../entities/famille.entite'
import { Participant } from '../../entities/participant.entite'
import { Event } from '../../entities/event.entite'

export interface Profile {
  id: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {


  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }

  async fetchActiviteData(): Promise<Activite[]> {
    const activiteQuery = await this.supabase
      .from('activite')
      .select()
    type ActiviteData = QueryData<typeof activiteQuery>

    const { data, error } = await activiteQuery
    if (error) throw error
    const activite: ActiviteData = data as ActiviteData
    return (activite  as Activite[]);
  }

  async fetchActiviteDataById(id:number): Promise<Activite> {
    const activiteQuery = await this.supabase
      .from('activite')
      .select()
      .eq('id',id)
    type ActiviteData = QueryData<typeof activiteQuery>

    const { data, error } = await activiteQuery
    if (error) throw error
    const activite: ActiviteData = data as ActiviteData
    return (activite[0]  as Activite);

  }

  async fetchEventDataByActiviteId(activiteId: number): Promise<Event[]>{
    const eventQuery = await this.supabase
      .from('event')
      .select()
      .eq('activite_id',activiteId)
    type EventData = QueryData<typeof eventQuery>

    const { data, error } = await eventQuery
    if (error) throw error
    const event: EventData = data as EventData
    return (event  as Event[]);
  }

  async fetchParticipantDataByEventId(eventId: number): Promise<Participant[]>{
    const participantQuery = await this.supabase
    .from('participant')
    .select()
    .eq('event_id',eventId)
  type ParticipantData = QueryData<typeof participantQuery>

  const { data, error } = await participantQuery
  if (error) throw error
  const participant: ParticipantData = data as ParticipantData
  return (participant  as Participant[]);
  }


  async fetchJeunesseData(): Promise<Jeune[]> {
    const jeuneAvecIdentiteEtFamilleQuery = await this.supabase
      .from('jeune')
      .select('id,scholarite,ecole,classe,scholarite_france, autorisation_photo, autorisation_medical,autorisation_sortie, prof_principale_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)), identite_id (id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),famille_id (id,nom,parentA_id(id,nom,prenom,date_naissance,nationalite,genre, contact_id(id,mobile,fixe,mail,adresse)),parentB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse))), accompagnateurA_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),accompagnateurB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)), urgenceA_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),urgenceB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse))')
    type JeuneAvecIdentiteEtFamille = QueryData<typeof jeuneAvecIdentiteEtFamilleQuery>

    const { data, error } = await jeuneAvecIdentiteEtFamilleQuery
    if (error) throw error
    const jeuneAvecIdentiteEtFamille: JeuneAvecIdentiteEtFamille = data as JeuneAvecIdentiteEtFamille

    return (jeuneAvecIdentiteEtFamille  as Jeune[]);
  }

  async fetchIdentiteData(): Promise<Identite[]> {
    const IdentiteAvecContactQuery = await this.supabase
      .from('identite')
      .select('id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)')
    type IdentiteAvecContact = QueryData<typeof IdentiteAvecContactQuery>

    const { data, error } = await IdentiteAvecContactQuery
    if (error) throw error
    const identiteAvecContact: IdentiteAvecContact = data as IdentiteAvecContact

    return (identiteAvecContact  as Identite[]);
  }

  async fetchFamilleData(): Promise<Famille[]> {
    const FamilleAvecParentsQuery = await this.supabase
      .from('famille')
      .select('id,nom,parentA_id(id,nom,prenom,date_naissance,nationalite,genre, contact_id(id,mobile,fixe,mail,adresse)),parentB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse))')
    type FamilleAvecParents = QueryData<typeof FamilleAvecParentsQuery>

    const { data, error } = await FamilleAvecParentsQuery
    if (error) throw error
    const familleAvecParents: FamilleAvecParents = data as FamilleAvecParents

    return (familleAvecParents  as Famille[]);
  }
 


  async fetchJeunesseDataById(id: number): Promise<Jeune> {
    const jeuneAvecIdentiteEtFamilleQuery = await this.supabase
    .from('jeune')
    .select('id,scholarite,ecole,classe,scholarite_france, autorisation_photo, autorisation_medical,autorisation_sortie, prof_principale_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)), identite_id (id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),famille_id (id,nom,parentA_id(id,nom,prenom,date_naissance,nationalite,genre, contact_id(id,mobile,fixe,mail,adresse)),parentB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse))), accompagnateurA_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),accompagnateurB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)), urgenceA_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),urgenceB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse))')
    .eq('id',id)
  type JeuneAvecIdentiteEtFamille = QueryData<typeof jeuneAvecIdentiteEtFamilleQuery>

  const { data, error } = await jeuneAvecIdentiteEtFamilleQuery
  if (error) throw error
  const jeuneAvecIdentiteEtFamille: JeuneAvecIdentiteEtFamille = data as JeuneAvecIdentiteEtFamille

  return (jeuneAvecIdentiteEtFamille[0]  as Jeune);
  }

  async updateActiviteData(activiteData: Activite){
    const { } = await this.supabase
      .from('activite')
      .update({
        nom: activiteData.nom,
        secteur: activiteData.secteur,
        enfant: activiteData.enfant,
        adulte: activiteData.adulte
      })
      .eq('id',activiteData.id);
  }


  async updateJeunesseData(jeuneData: Jeune) {
    console.log("starting");
    const { } = await this.supabase
      .from('jeune')
      .update({ 
        identite_id: jeuneData.identite_id.id,
        ecole: jeuneData.ecole,
        scholarite: jeuneData.scholarite,
        scholarite_france: jeuneData.scholarite_france,
        prof_principale_id: jeuneData.prof_principale_id.id,
        classe: jeuneData.classe,
        famille_id: jeuneData.famille_id.id,
        autorisation_photo: jeuneData.autorisation_photo,
        autorisation_medical: jeuneData.autorisation_medical,
        autorisation_sortie: jeuneData.autorisation_sortie,
        accompagnateurA_id: jeuneData.accompagnateurA_id.id,
        accompagnateurB_id: jeuneData.accompagnateurB_id.id,
        urgenceA_id: jeuneData.urgenceA_id.id,
        urgenceB_id: jeuneData.urgenceB_id.id

      })
      .eq('id', jeuneData.id);
    console.log("done");

  }
  async updateContactData(contactData: Contact) {
    const { } = await this.supabase
      .from('contact')
      .update({
         mobile: contactData.mobile,
         fixe: contactData.fixe,
         mail: contactData.mail,
         adresse: contactData.adresse
      })
      .eq('id', contactData.id);

  }
  async updateIdentiteData(identiteData: Identite) {
    const { } = await this.supabase
      .from('identite')
      .update({
        nom: identiteData.nom,
        prenom: identiteData.prenom,
        date_naissance: identiteData.date_naissance,
        nationalite: identiteData.nationalite,
        genre: identiteData.genre,
        contact_id: identiteData.contact_id.id
      })
      .eq('id', identiteData.id);

  }
  async supprimerJeuneData(id: number){
    const response = await this.supabase
    .from('jeune')
    .delete()
    .eq('id', id);
  }

  async updateFamilleData(familleData: Famille) {
    const { } = await this.supabase
      .from('famille')
      .update({
        nom: familleData.nom,
        parentA_id: familleData.parentA_id.id,
        parentB_id: familleData.parentB_id.id
      })
      .eq('id', familleData.id);

  }
 
  async insertJeunesseData(jeuneData: Jeune): Promise<Jeune> {
    const jeuneDataQuery= await this.supabase
      .from('jeune')
      .insert({ 
        identite_id: jeuneData.identite_id.id,
        ecole: jeuneData.ecole,
        scholarite: jeuneData.scholarite,
        scholarite_france: jeuneData.scholarite_france,
        accompagnateurA_id: jeuneData.accompagnateurA_id.id,
        accompagnateurB_id: jeuneData.accompagnateurB_id.id,
        urgenceA_id: jeuneData.urgenceA_id.id,
        urgenceB_id: jeuneData.urgenceB_id.id,
        prof_principale_id: jeuneData.prof_principale_id.id,
        classe: jeuneData.classe,
        famille_id: jeuneData.famille_id.id,
        autorisation_photo: jeuneData.autorisation_photo,
        autorisation_medical: jeuneData.autorisation_medical,
        autorisation_sortie: jeuneData.autorisation_sortie
      })
      .select()
    type jeuneData= QueryData<typeof jeuneDataQuery>
    console.log("test")
    const { data, error } = await jeuneDataQuery
    if (error) throw error
    const jeuneAvecIdentiteEtFamille: jeuneData = data as jeuneData
    console.log("test")
    return (jeuneAvecIdentiteEtFamille[0]  as Jeune);

  }
  async insertContactData(contactData: Contact): Promise<Contact> {
    const contactDataQuery= await this.supabase
      .from('contact')
      .insert({
         mobile: contactData.mobile,
         fixe: contactData.fixe,
         mail: contactData.mail,
         adresse: contactData.adresse
      })
      .select()
      type contactData = QueryData<typeof contactDataQuery>

      const { data, error } = await contactDataQuery
      if (error) throw error
      const contact: contactData = data as contactData
  
      return (contact[0]  as Contact);

  }
  async insertIdentiteData(identiteData: Identite): Promise<Identite> {
    const identiteDataQuery= await this.supabase
      .from('identite')
      .insert({
        nom: identiteData.nom,
        prenom: identiteData.prenom,
        date_naissance: identiteData.date_naissance,
        nationalite: identiteData.date_naissance,
        genre: identiteData.genre,
        contact_id: identiteData.contact_id.id
      })
      .select()
      type identiteData = QueryData<typeof identiteDataQuery>

      const { data, error } = await identiteDataQuery
      if (error) throw error
      const identite: identiteData = data as identiteData
  
      return (identite[0]  as Identite);

  }



  async insertFamilleData(familleData: Famille):Promise<Famille> {
    const familleDataQuery= await this.supabase
      .from('famille')
      .insert({
        nom: familleData.nom,
        parentA_id: familleData.parentA_id.id,
        parentB_id: familleData.parentB_id.id
      })
      .select()
      type familleData = QueryData<typeof familleDataQuery>

      const { data, error } = await familleDataQuery
      if (error) throw error
      const famille: familleData = data as familleData
  
      return (famille[0]  as Famille);

  }





}