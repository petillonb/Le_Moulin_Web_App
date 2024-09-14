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
import { Activité } from '../../entities/activité.entite'
import { Jeune } from '../../entities/jeune.entite'
import { Identite } from '../../entities/identite.entite'
import { Contact } from '../../entities/contact.entite'
import { Famille } from '../../entities/famille.entite'

export interface Profile {
  id?: string
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

  async fetchJeunesseData(): Promise<Jeune[]> {
    const jeuneAvecIdentiteEtFamilleQuery = await this.supabase
      .from('jeune')
      .select('id,scholarite,ecole,classe, prof_principale_id(id,nom,prenom,date_naissance,nationalite,genre, contact_id(id,mobile,fixe,mail,adresse)), identite_id (id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),famille_id (id,nom,parentA_id(id,nom,prenom,date_naissance,nationalite,genre, contact_id(id,mobile,fixe,mail,adresse)),parentB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)))')
    type JeuneAvecIdentiteEtFamille = QueryData<typeof jeuneAvecIdentiteEtFamilleQuery>

    const { data, error } = await jeuneAvecIdentiteEtFamilleQuery
    if (error) throw error
    const jeuneAvecIdentiteEtFamille: JeuneAvecIdentiteEtFamille = data as JeuneAvecIdentiteEtFamille

    return (jeuneAvecIdentiteEtFamille  as Jeune[]);
  }

  async fetchJeunesseDataById(id: number): Promise<Jeune> {
    const jeuneAvecIdentiteEtFamilleQuery = await this.supabase
    .from('jeune')
    .select('id,scholarite,ecole,classe, prof_principale_id(id,nom,prenom,date_naissance,nationalite,genre, contact_id(id,mobile,fixe,mail,adresse)), identite_id (id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)),famille_id (id,nom,parentA_id(id,nom,prenom,date_naissance,nationalite,genre, contact_id(id,mobile,fixe,mail,adresse)),parentB_id(id,nom,prenom,date_naissance,nationalite,genre,contact_id(id,mobile,fixe,mail,adresse)))')
    .eq('id',id)
  type JeuneAvecIdentiteEtFamille = QueryData<typeof jeuneAvecIdentiteEtFamilleQuery>

  const { data, error } = await jeuneAvecIdentiteEtFamilleQuery
  if (error) throw error
  const jeuneAvecIdentiteEtFamille: JeuneAvecIdentiteEtFamille = data as JeuneAvecIdentiteEtFamille

  return (jeuneAvecIdentiteEtFamille[0]  as Jeune);
  }
  async fetchActivitéData(): Promise<Activité[]> {
    const { data, error } = await this.supabase
      .from('Action')
      .select<'*', Activité>()
    console.log("fetchActivitéData", data, error);

    if (error) {
      console.log(error)
      return []
    }
    return (data);
  }



  async updateJeunesseData(jeuneData: Jeune) {
    console.log("saving")
    const { } = await this.supabase
      .from('test')
      .update({ 
        identite_id: jeuneData.identite_id.id,
        ecole: jeuneData.ecole,
        scholarise: jeuneData.scholarise,
        prof_principale_id: jeuneData.prof_principale_id.id,
        classe: jeuneData.classe,
        famille_id: jeuneData.famille_id.id
      })
      .eq('id', jeuneData.id);

  }
  async updateContactData(contactData: Contact) {
    const { } = await this.supabase
      .from('test')
      .update({
         mobile: contactData.mobile,
         fixe: contactData.fixe,
         mail: contactData.mail,
         adresse: contactData.adresse
      })
      .eq('id', contactData.id);

  }
  async updateIdentiteData(identiteData: Identite) {
    console.log("saving")
    const { } = await this.supabase
      .from('test')
      .update({
        nom: identiteData.nom,
        prenom: identiteData.prenom,
        date_naissance: identiteData.date_naissance,
        nationalite: identiteData.date_naissance,
        genre: identiteData.genre,
        contact_id: identiteData.contact_id.id
      })
      .eq('id', identiteData.id);

  }
  async updateFamilleData(familleData: Famille) {
    console.log("saving")
    const { } = await this.supabase
      .from('test')
      .update({
        nom: familleData.nom,
        parentA_id: familleData.parentA_id.id,
        parentB_id: familleData.parentB_id.id
      })
      .eq('id', familleData.id);

  }

  async insertJeunesseData(jeuneData: Jeune) {
    console.log("saving")
    const { } = await this.supabase
      .from('test')
      .insert({
        // firstName: jeuneData.firstName, 
        // lastName: jeuneData.lastName,
        // mobile: jeuneData.mobile,
        // fixe: jeuneData.fixe,
        // mail: jeuneData.mail,
        // adresse: jeuneData.adresse
      })
      .select()

  }

}