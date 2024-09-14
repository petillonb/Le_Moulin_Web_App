import { CommonModule } from '@angular/common';
import { Component, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Jeune } from '../entities/jeune.entite';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@Component({
  selector: 'app-profile-jeune',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  providers: [SupabaseService],
  templateUrl: './profile-jeune.component.html',
  styleUrl: './profile-jeune.component.scss'
})
export class ProfileJeuneComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly supabaseService: SupabaseService,


  ) { }
  disabled = model(false);
  editMode = false;
  jeuneData: Jeune;
  jeuneOriginalData: Jeune;
  form: FormGroup;



  id: number;
  ngOnInit() {
    
    this.form = new FormGroup({
      nom_jeune: new FormControl(''),
      prenom_jeune:new FormControl(''),
      date_naissance_jeune:new FormControl(''),
      nationalite_jeune:new FormControl(''),
      genre_jeune:new FormControl(''),
      mobile_jeune:new FormControl(''),
      fixe_jeune:new FormControl(''),
      mail_jeune:new FormControl(''),
      adresse_jeune:new FormControl(''),
      nom_famille: new FormControl(''),
      classe: new FormControl(''),
      scholarite: new FormControl(''),
      nom_parentA: new FormControl(''),
      prenom_parentA:new FormControl(''),
      mobile_parentA:new FormControl(''),
      fixe_parentA:new FormControl(''),
      mail_parentA:new FormControl(''),
      adresse_parentA:new FormControl(''),
      nom_parentB: new FormControl(''),
      prenom_parentB:new FormControl(''),
      mobile_parentB:new FormControl(''),
      fixe_parentB:new FormControl(''),
      mail_parentB:new FormControl(''),
      adresse_parentB:new FormControl(''),
      nom_prof_principale: new FormControl(''),
      prenom_prof_principale:new FormControl(''),
      mobile_prof_principale:new FormControl(''),
      fixe_prof_principale:new FormControl(''),
      mail_prof_principale:new FormControl(''),
      adresse_prof_principale:new FormControl(''),
    });
    this.form.disable();
   
  
    
    this.route.params.subscribe(async (params) => {
      this.jeuneOriginalData = await this.supabaseService.fetchJeunesseDataById(params['id']);
      this.jeuneData = structuredClone(this.jeuneOriginalData);  
      this.patchValue();
      this.id = params['id'];
    })
    
  }
  patchValue(){
    this.form.patchValue({
      nom_jeune: this.jeuneData.identite_id.nom,
      prenom_jeune: this.jeuneData.identite_id.prenom,
      date_naissance_jeune: this.jeuneData.identite_id.date_naissance,
      nationalite_jeune: this.jeuneData.identite_id.nationalite,
      genre_jeune: this.jeuneData.identite_id.genre,
      mobile_jeune:this.jeuneData.identite_id.contact_id.mobile,
      fixe_jeune: this.jeuneData.identite_id.contact_id.fixe,
      mail_jeune: this.jeuneData.identite_id.contact_id.mail,
      adresse_jeune: this.jeuneData.identite_id.contact_id.adresse,
      nom_famille: this.jeuneData.famille_id.nom,
      classe: this.jeuneData.classe,
      scholarite: this.jeuneData.scholarise,
      nom_parentA: this.jeuneData.famille_id.parentA_id.nom,
      prenom_parentA: this.jeuneData.famille_id.parentA_id.prenom,
      mobile_parentA: this.jeuneData.famille_id.parentA_id.contact_id.mobile,
      fixe_parentA: this.jeuneData.famille_id.parentA_id.contact_id.fixe,
      mail_parentA: this.jeuneData.famille_id.parentA_id.contact_id.mail,
      adresse_parentA: this.jeuneData.famille_id.parentA_id.contact_id.adresse,
      nom_parentB: this.jeuneData.famille_id.parentB_id.nom,
      prenom_parentB: this.jeuneData.famille_id.parentB_id.prenom,
      mobile_parentB: this.jeuneData.famille_id.parentB_id.contact_id.mobile,
      fixe_parentB: this.jeuneData.famille_id.parentB_id.contact_id.fixe,
      mail_parentB: this.jeuneData.famille_id.parentB_id.contact_id.mail,
      adresse_parentB: this.jeuneData.famille_id.parentB_id.contact_id.adresse,
      nom_prof_principale: this.jeuneData.prof_principale_id.nom,
      prenom_prof_principale: this.jeuneData.prof_principale_id.prenom,
      mobile_prof_principale: this.jeuneData.prof_principale_id.contact_id.mobile,
      fixe_prof_principale: this.jeuneData.prof_principale_id.contact_id.fixe,
      mail_prof_principale: this.jeuneData.prof_principale_id.contact_id.mail,
      adresse_prof_principale: this.jeuneData.prof_principale_id.contact_id.adresse,
    });
    
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.form.enable();
    } else {
      this.form.disable();
      this.resetData();
    }
  }

  resetData() {
    this.jeuneData = structuredClone(this.jeuneOriginalData);
    this.patchValue;
  }
  updateJeuneTable(){
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.supabaseService.updateIdentiteData(this.jeuneData.identite_id)
    this.supabaseService.updateContactData(this.jeuneData.identite_id.contact_id);
  }
  updateProfTable(){
    this.supabaseService.updateIdentiteData(this.jeuneData.prof_principale_id)
    this.supabaseService.updateContactData(this.jeuneData.prof_principale_id.contact_id);
  }
  updateJeuneFamilleTable(){
    this.supabaseService.updateFamilleData(this.jeuneData.famille_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.famille_id.parentA_id);
    this.supabaseService.updateContactData(this.jeuneData.famille_id.parentA_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.famille_id.parentB_id);
    this.supabaseService.updateContactData(this.jeuneData.famille_id.parentB_id.contact_id);
  }
  updateJeuneData() {
    // Update only the values in identite_id that are managed by the form
    this.jeuneData.identite_id.nom = this.form.controls['nom_jeune'].value;
    this.jeuneData.identite_id.prenom = this.form.controls['prenom_jeune'].value;
    this.jeuneData.identite_id.date_naissance = this.form.controls['date_naissance_jeune'].value;
    this.jeuneData.identite_id.nationalite = this.form.controls['nationalite_jeune'].value;
    this.jeuneData.identite_id.genre = this.form.controls['genre_jeune'].value;
    
    // Update only contact_id fields within identite_id
    this.jeuneData.identite_id.contact_id.mobile = this.form.controls['mobile_jeune'].value;
    this.jeuneData.identite_id.contact_id.fixe = this.form.controls['fixe_jeune'].value;
    this.jeuneData.identite_id.contact_id.mail = this.form.controls['mail_jeune'].value;
    this.jeuneData.identite_id.contact_id.adresse = this.form.controls['adresse_jeune'].value;
  
    // Update only the values in famille_id that are managed by the form
    if (this.jeuneData.famille_id) {
      this.jeuneData.famille_id.nom = this.form.controls['nom_famille'].value;
      
      // Update only parentA_id fields within famille_id
      if (this.jeuneData.famille_id.parentA_id) {
        this.jeuneData.famille_id.parentA_id.nom = this.form.controls['nom_parentA'].value;
        this.jeuneData.famille_id.parentA_id.prenom = this.form.controls['prenom_parentA'].value;
        this.jeuneData.famille_id.parentA_id.contact_id.mobile = this.form.controls['mobile_parentA'].value;
        this.jeuneData.famille_id.parentA_id.contact_id.fixe = this.form.controls['fixe_parentA'].value;
        this.jeuneData.famille_id.parentA_id.contact_id.mail = this.form.controls['mail_parentA'].value;
        this.jeuneData.famille_id.parentA_id.contact_id.adresse = this.form.controls['adresse_parentA'].value;
      }
  
      // Update only parentB_id fields within famille_id
      if (this.jeuneData.famille_id.parentB_id) {
        this.jeuneData.famille_id.parentB_id.nom = this.form.controls['nom_parentB'].value;
        this.jeuneData.famille_id.parentB_id.prenom = this.form.controls['prenom_parentB'].value;
        this.jeuneData.famille_id.parentB_id.contact_id.mobile = this.form.controls['mobile_parentB'].value;
        this.jeuneData.famille_id.parentB_id.contact_id.fixe = this.form.controls['fixe_parentB'].value;
        this.jeuneData.famille_id.parentB_id.contact_id.mail = this.form.controls['mail_parentB'].value;
        this.jeuneData.famille_id.parentB_id.contact_id.adresse = this.form.controls['adresse_parentB'].value;
      }
    }
  
    // Update only the values in classe and scholarise fields
    this.jeuneData.classe = this.form.controls['classe'].value;
    this.jeuneData.scholarise = this.form.controls['scholarite'].value;
  
    // Update only prof_principale_id fields that are managed by the form
    if (this.jeuneData.prof_principale_id) {
      this.jeuneData.prof_principale_id.nom = this.form.controls['nom_prof_principale'].value;
      this.jeuneData.prof_principale_id.prenom = this.form.controls['prenom_prof_principale'].value;
      this.jeuneData.prof_principale_id.contact_id.mobile = this.form.controls['mobile_prof_principale'].value;
      this.jeuneData.prof_principale_id.contact_id.fixe = this.form.controls['fixe_prof_principale'].value;
      this.jeuneData.prof_principale_id.contact_id.mail = this.form.controls['mail_prof_principale'].value;
      this.jeuneData.prof_principale_id.contact_id.adresse = this.form.controls['adresse_prof_principale'].value;
    }
  }
  

  saveData() {
    if (!this.editMode) {
      return;
    }
    this.updateJeuneData;
    this.updateJeuneTable;
    this.updateJeuneFamilleTable;
    this.updateProfTable;
  
    console.log(this.id);
    console.log("saved");
    this.editMode = !this.editMode;
    this.form.disable();
    
  }
  

  goBack() {
    this.router.navigate(['jeunesse']);
  }


}
