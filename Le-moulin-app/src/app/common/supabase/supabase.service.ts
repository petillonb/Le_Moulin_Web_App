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
      .select('scholarite,ecole,classe,prof_principale, identite_id (nom,prenom,date_naissance,nationalite,genre),famille_id (nom)')
    type JeuneAvecIdentiteEtFamille = QueryData<typeof jeuneAvecIdentiteEtFamilleQuery>

    const { data, error } = await jeuneAvecIdentiteEtFamilleQuery
    if (error) throw error
    const jeuneAvecIdentiteEtFamille: JeuneAvecIdentiteEtFamille = data as JeuneAvecIdentiteEtFamille

    return (jeuneAvecIdentiteEtFamille  as Jeune[]);
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

  async fetchJeunesseDataById(id: string): Promise<Jeune> {
    const { data, error } = await this.supabase
      .from('test')
      .select<'*', Jeune>()
      .eq('id', id)
    console.log("fetchJeunesseDataById", data, error);
    if (error && data && data[0] == null) {
      console.log(error)
      return {} as Jeune
    }
    return data![0]
  }
  async updateJeunesseData(jeuneData: Jeune, id: number) {
    console.log("saving")
    const { } = await this.supabase
      .from('test')
      .update({
        // firstName: jeuneData.firstName, 
        // lastName: jeuneData.lastName,
        // mobile: jeuneData.mobile,
        // fixe: jeuneData.fixe,
        // mail: jeuneData.mail,
        // adresse: jeuneData.adresse
      })
      .eq('id', id);

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