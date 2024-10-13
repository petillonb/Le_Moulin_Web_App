import { JsonPipe, CommonModule, AsyncPipe, formatPercent } from '@angular/common';
import { Component, model, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Jeune } from '../entities/jeune.entite';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, FormBuilder } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Identite } from '../entities/identite.entite';
import { Famille } from '../entities/famille.entite';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';





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
    MatSlideToggleModule,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatCheckboxModule,
    MatCardModule,
    JsonPipe,
    MatDatepickerModule
  ],
  providers: [SupabaseService, provideNativeDateAdapter()],
  templateUrl: './profile-jeune.component.html',
  styleUrl: './profile-jeune.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileJeuneComponent implements OnInit {
  @ViewChild('inputParentA') inputParentA: ElementRef<HTMLInputElement>;
  @ViewChild('inputParentB') inputParentB: ElementRef<HTMLInputElement>;
  @ViewChild('inputProf') inputProf: ElementRef<HTMLInputElement>;
  @ViewChild('inputFamille') inputFamille: ElementRef<HTMLInputElement>;
  @ViewChild('inputAccompagnateurA') inputAccompagnateurA: ElementRef<HTMLInputElement>;
  @ViewChild('inputAccompagnateurB') inputAccompagnateurB: ElementRef<HTMLInputElement>;
  @ViewChild('inputUrgenceA') inputUrgenceA: ElementRef<HTMLInputElement>;
  @ViewChild('inputUrgenceB') inputUrgenceB: ElementRef<HTMLInputElement>;
  optionsIdentite: string[] = [''];
  filteredOptionsIdentite: string[];
  optionsFamille: string[] = [''];

  filteredOptionsFamille: string[];







  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly supabaseService: SupabaseService,
  ) {
    this.filteredOptionsIdentite = this.optionsIdentite.slice();
    this.filteredOptionsFamille = this.optionsFamille.slice();

  }
  filterParentA(): void {
    const filterParentAValue = this.inputParentA.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterParentAValue));
    this.addParentA(this.inputParentA.nativeElement.value);

  }
  filterParentB(): void {
    const filterParentBValue = this.inputParentB.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterParentBValue));
    this.addParentB(this.inputParentB.nativeElement.value);

  }
  filterAccompagnateurA(): void {
    const filterAccompagnateurAValue = this.inputAccompagnateurA.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterAccompagnateurAValue));
    this.addAccompagnateurA(this.inputAccompagnateurA.nativeElement.value);

  }
  filterAccompagnateurB(): void {
    const filterAccompagnateurBValue = this.inputAccompagnateurB.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterAccompagnateurBValue));
    this.addAccompagnateurB(this.inputAccompagnateurB.nativeElement.value);
  }

  filterUrgenceA(): void {
    const filterUrgenceAValue = this.inputUrgenceA.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterUrgenceAValue));
    this.addUrgenceA(this.inputUrgenceA.nativeElement.value);
  }

  filterUrgenceB(): void {
    const filterUrgenceBValue = this.inputUrgenceB.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterUrgenceBValue));
    this.addUrgenceB(this.inputUrgenceB.nativeElement.value);
  }
  filterProf(): void {
    const filterProfValue = this.inputProf.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterProfValue));
    this.addProf(this.inputProf.nativeElement.value);
  }
  filterFamille(): void {
    const filterFamilleValue = this.inputFamille.nativeElement.value.toLowerCase();
    this.filteredOptionsFamille = this.optionsFamille.filter(o => o.toLowerCase().includes(filterFamilleValue));
    console.log("filterfamille", this.optionsFamille);
    this.addFamille(this.inputFamille.nativeElement.value);
  }



  identiteList: Identite[];
  familleList: Famille[];
  jeuneData: Jeune;
  jeuneOriginalData: Jeune;

  familleControl = new FormControl('');
  profControl = new FormControl('');
  parentAControl = new FormControl('');
  parentBControl = new FormControl('');
  AccompagnateurAControl = new FormControl('');
  AccompagnateurBControl = new FormControl('');
  UrgenceAControl = new FormControl('');
  UrgenceBControl = new FormControl('');


  formJeune: FormGroup;
  jeuneEditMode = false;

  formFamille: FormGroup;
  familleEditMode = false;

  formParentA: FormGroup;
  parentAEditMode = false;

  formParentB: FormGroup;
  parentBEditMode = false;

  formProf: FormGroup;
  profEditMode = false;

  formAccompagnateurA: FormGroup;
  accompagnateurAEditMode = false;

  formAccompagnateurB: FormGroup;
  accompagnateurBEditMode = false;

  formUrgenceA: FormGroup;
  urgenceAEditMode = false;

  formUrgenceB: FormGroup;
  urgenceBEditMode = false;


  id: number;
  ngOnInit() {

    this.jeuneData = {
      id: null,
      ecole: null,
      classe: null,
      scholarite: null,
      scholarite_france: null,
      autorisation_medical: null,
      autorisation_photo: null,
      autorisation_sortie: null,
      accompagnateurA_id: {
        id: null,
        nom: null,
        prenom: null,
        date_naissance: null,
        genre: null,
        nationalite: null,
        contact_id: {
          id: null,
          mobile: null,
          fixe: null,
          mail: null,
          adresse: null,
        },
      },
      accompagnateurB_id: {
        id: null,
        nom: null,
        prenom: null,
        date_naissance: null,
        genre: null,
        nationalite: null,
        contact_id: {
          id: null,
          mobile: null,
          fixe: null,
          mail: null,
          adresse: null,
        },
      },
      urgenceA_id: {
        id: null,
        nom: null,
        prenom: null,
        date_naissance: null,
        genre: null,
        nationalite: null,
        contact_id: {
          id: null,
          mobile: null,
          fixe: null,
          mail: null,
          adresse: null,
        },
      },
      urgenceB_id: {
        id: null,
        nom: null,
        prenom: null,
        date_naissance: null,
        genre: null,
        nationalite: null,
        contact_id: {
          id: null,
          mobile: null,
          fixe: null,
          mail: null,
          adresse: null,
        },
      },
      identite_id: {
        id: null,
        nom: null,
        prenom: null,
        date_naissance: null,
        genre: null,
        nationalite: null,
        contact_id: {
          id: null,
          mobile: null,
          fixe: null,
          mail: null,
          adresse: null,
        },
      },
      famille_id: {
        id: null,
        nom: null,
        parentA_id: {
          id: null,
          nom: null,
          prenom: null,
          date_naissance: null,
          genre: null,
          nationalite: null,
          contact_id: {
            id: null,
            mobile: null,
            fixe: null,
            mail: null,
            adresse: null,
          },
        },
        parentB_id: {
          id: null,
          nom: null,
          prenom: null,
          date_naissance: null,
          genre: null,
          nationalite: null,
          contact_id: {
            id: null,
            mobile: null,
            fixe: null,
            mail: null,
            adresse: null,
          },
        },
      },
      prof_principale_id: {
        id: null,
        nom: null,
        prenom: null,
        date_naissance: null,
        genre: null,
        nationalite: null,
        contact_id: {
          id: null,
          mobile: null,
          fixe: null,
          mail: null,
          adresse: null,
        },
      },

    }


    this.formJeune = new FormGroup({
      ecole: new FormControl(''),
      classe: new FormControl(''),
      nom_jeune: new FormControl(''),
      prenom_jeune: new FormControl(''),
      nationalite_jeune: new FormControl(''),
      date_naissance_jeune: new FormControl<Date | null>(null),
      genre_jeune: new FormControl(''),
      mobile_jeune: new FormControl(''),
      fixe_jeune: new FormControl(''),
      mail_jeune: new FormControl(''),
      adresse_jeune: new FormControl(''),
      scholarite: new FormControl(false),
      scholarite_france: new FormControl(false),
      autorisation_photo: new FormControl(false),
      autorisation_medical: new FormControl(false),
      autorisation_sortie: new FormControl(false)
    });
    this.formJeune.disable();

    this.formFamille = new FormGroup({
      nom_famille: new FormControl(''),
    });
    this.formFamille.disable();

    this.formParentA = new FormGroup({
      nom_parentA: new FormControl(''),
      prenom_parentA: new FormControl(''),
      mobile_parentA: new FormControl(''),
      fixe_parentA: new FormControl(''),
      mail_parentA: new FormControl(''),
      adresse_parentA: new FormControl(''),
    });
    this.formParentA.disable();

    this.formParentB = new FormGroup({
      nom_parentB: new FormControl(''),
      prenom_parentB: new FormControl(''),
      mobile_parentB: new FormControl(''),
      fixe_parentB: new FormControl(''),
      mail_parentB: new FormControl(''),
      adresse_parentB: new FormControl(''),
    });
    this.formParentB.disable();

    this.formProf = new FormGroup({
      nom_prof_principale: new FormControl(''),
      prenom_prof_principale: new FormControl(''),
      mobile_prof_principale: new FormControl(''),
      fixe_prof_principale: new FormControl(''),
      mail_prof_principale: new FormControl(''),
      adresse_prof_principale: new FormControl(''),

    });
    this.formProf.disable();

    this.formAccompagnateurA = new FormGroup({
      nom_accompagnateurA: new FormControl(''),
      prenom_accompagnateurA: new FormControl(''),
      mobile_accompagnateurA: new FormControl(''),
      fixe_accompagnateurA: new FormControl(''),
    });
    this.formAccompagnateurA.disable();

    this.formAccompagnateurB = new FormGroup({
      nom_accompagnateurB: new FormControl(''),
      prenom_accompagnateurB: new FormControl(''),
      mobile_accompagnateurB: new FormControl(''),
      fixe_accompagnateurB: new FormControl(''),
    });
    this.formAccompagnateurB.disable();

    this.formUrgenceA = new FormGroup({
      nom_urgenceA: new FormControl(''),
      prenom_urgenceA: new FormControl(''),
      mobile_urgenceA: new FormControl(''),
      fixe_urgenceA: new FormControl(''),
    });
    this.formUrgenceA.disable();

    this.formUrgenceB = new FormGroup({
      nom_urgenceB: new FormControl(''),
      prenom_urgenceB: new FormControl(''),
      mobile_urgenceB: new FormControl(''),
      fixe_urgenceB: new FormControl(''),
    });
    this.formUrgenceB.disable();



    console.log("00");
    this.route.params.subscribe(async (params) => { 
      this.identiteList = await this.supabaseService.fetchIdentiteData();
      this.familleList = await this.supabaseService.fetchFamilleData();
      this.jeuneOriginalData = await this.supabaseService.fetchJeunesseDataById(params['id']);
      this.mergeJeuneData();
      console.log("jeune fetched", this.jeuneOriginalData);
      console.log("jeune created", this.jeuneData);
      console.log("jeune merged", this.jeuneData);

      this.patchValue();
      this.id = params['id'];
      this.fillIdentiteOptionList();
      this.fillFamilleOptionList();

    })

  }
  fillFamilleOptionList() {
    for (let i = 0; i < this.optionsFamille.length; i++) {
      this.optionsFamille.pop();
    }
    for (let i = 0; i < this.familleList.length; i++) {
      console.log(this.familleList[i].nom);
      this.optionsFamille.push(this.familleList[i].nom);
    }
    console.log(this.optionsFamille);

  }

  fillIdentiteOptionList() {
    for (let i = 0; i < this.optionsIdentite.length; i++) {
      this.optionsIdentite.pop();
    }
    for (let i = 0; i < this.identiteList.length; i++) {
      this.optionsIdentite.push(this.identiteList[i].nom + " " + this.identiteList[i].prenom);
    }

  }

  patchValue() {
    console.log("patchting value 1");
    this.formJeune.patchValue({
      classe: this.jeuneData.classe,
      scholarite: this.jeuneData.scholarite,
      scholarite_france: this.jeuneData.scholarite_france,
      echole: this.jeuneData.ecole,
      autorisation_sortie: this.jeuneData.autorisation_sortie,
      autorisation_medical: this.jeuneData.autorisation_medical,
      autorisation_photo: this.jeuneData.autorisation_photo
    });
    if (this.jeuneData.identite_id) {
      this.formJeune.patchValue({
        nom_jeune: this.jeuneData.identite_id.nom,
        prenom_jeune: this.jeuneData.identite_id.prenom,
        date_naissance_jeune: this.jeuneData.identite_id.date_naissance,
        nationalite_jeune: this.jeuneData.identite_id.nationalite,
        genre_jeune: this.jeuneData.identite_id.genre
      });
      if (this.jeuneData.identite_id.contact_id) {
        this.formJeune.patchValue({
          mobile_jeune: this.jeuneData.identite_id.contact_id.mobile,
          fixe_jeune: this.jeuneData.identite_id.contact_id.fixe,
          mail_jeune: this.jeuneData.identite_id.contact_id.mail,
          adresse_jeune: this.jeuneData.identite_id.contact_id.adresse
        });
      }
    }
    if (this.jeuneData.famille_id) {
      this.familleControl.patchValue(this.jeuneData.famille_id.nom);
      this.formFamille.patchValue({
        nom_famille: this.jeuneData.famille_id.nom
      });
      if (this.jeuneData.famille_id.parentA_id) {
        this.parentAControl.patchValue(this.jeuneData.famille_id.parentA_id.nom + " " + this.jeuneData.famille_id.parentA_id.prenom);
        this.formParentA.patchValue({
          nom_parentA: this.jeuneData.famille_id.parentA_id.nom,
          prenom_parentA: this.jeuneData.famille_id.parentA_id.prenom
        });
        if (this.jeuneData.famille_id.parentA_id.contact_id) {
          this.formParentA.patchValue({
            mobile_parentA: this.jeuneData.famille_id.parentA_id.contact_id.mobile,
            fixe_parentA: this.jeuneData.famille_id.parentA_id.contact_id.fixe,
            mail_parentA: this.jeuneData.famille_id.parentA_id.contact_id.mail,
            adresse_parentA: this.jeuneData.famille_id.parentA_id.contact_id.adresse
          });
        }
      }
      if (this.jeuneData.famille_id.parentB_id) {
        this.parentBControl.patchValue(this.jeuneData.famille_id.parentB_id.nom + " " + this.jeuneData.famille_id.parentB_id.prenom);
        this.formParentB.patchValue({
          nom_parentB: this.jeuneData.famille_id.parentB_id.nom,
          prenom_parentB: this.jeuneData.famille_id.parentB_id.prenom
        });
        if (this.jeuneData.famille_id.parentB_id.contact_id) {
          this.formParentB.patchValue({
            mobile_parentB: this.jeuneData.famille_id.parentB_id.contact_id.mobile,
            fixe_parentB: this.jeuneData.famille_id.parentB_id.contact_id.fixe,
            mail_parentB: this.jeuneData.famille_id.parentB_id.contact_id.mail,
            adresse_parentB: this.jeuneData.famille_id.parentB_id.contact_id.adresse,
          });
        }
      }

    }
    if (this.jeuneData.prof_principale_id) {
      this.profControl.patchValue(this.jeuneData.prof_principale_id.nom + " " + this.jeuneData.prof_principale_id.prenom);
      this.formProf.patchValue({
        nom_prof_principale: this.jeuneData.prof_principale_id.nom,
        prenom_prof_principale: this.jeuneData.prof_principale_id.prenom
      });
      if (this.jeuneData.prof_principale_id.contact_id) {
        this.formProf.patchValue({
          mobile_prof_principale: this.jeuneData.prof_principale_id.contact_id.mobile,
          fixe_prof_principale: this.jeuneData.prof_principale_id.contact_id.fixe,
          mail_prof_principale: this.jeuneData.prof_principale_id.contact_id.mail,
          adresse_prof_principale: this.jeuneData.prof_principale_id.contact_id.adresse,
        })
      }
    }
    if (this.jeuneData.accompagnateurA_id) {
      console.log("patchting formAccompagnateurAID");
      this.AccompagnateurAControl.patchValue(this.jeuneData.accompagnateurA_id.nom + " " + this.jeuneData.accompagnateurA_id.prenom);
      this.formAccompagnateurA.patchValue({
        nom_accompagnateurA: this.jeuneData.accompagnateurA_id.nom,
        prenom_accompagnateurA: this.jeuneData.accompagnateurA_id.prenom
      });
      if (this.jeuneData.accompagnateurA_id.contact_id) {
        console.log("patchting formAccompagnateurAContact");
        this.formAccompagnateurA.patchValue({
          mobile_accompagnateurA: this.jeuneData.accompagnateurA_id.contact_id.mobile,
          fixe_accompagnateurA: this.jeuneData.accompagnateurA_id.contact_id.fixe

        })
      }
    }
    if (this.jeuneData.accompagnateurB_id) {
      console.log("patchting formAccompagnateurBID");
      this.AccompagnateurBControl.patchValue(this.jeuneData.accompagnateurB_id.nom + " " + this.jeuneData.accompagnateurB_id.prenom);
      this.formAccompagnateurB.patchValue({
        nom_accompagnateurB: this.jeuneData.accompagnateurB_id.nom,
        prenom_accompagnateurB: this.jeuneData.accompagnateurB_id.prenom
      });
      if (this.jeuneData.accompagnateurB_id.contact_id) {
        console.log("patchting formAccompagnateurBContact");
        this.formAccompagnateurB.patchValue({
          mobile_accompagnateurB: this.jeuneData.accompagnateurB_id.contact_id.mobile,
          fixe_accompagnateurB: this.jeuneData.accompagnateurB_id.contact_id.fixe

        })
      }
    }
    if (this.jeuneData.urgenceA_id) {
      console.log("patchting formUrgenceAID");
      this.UrgenceAControl.patchValue(this.jeuneData.urgenceA_id.nom + " " + this.jeuneData.urgenceA_id.prenom);
      this.formUrgenceA.patchValue({
        nom_urgenceA: this.jeuneData.urgenceA_id.nom,
        prenom_urgenceA: this.jeuneData.urgenceA_id.prenom
      });
      if (this.jeuneData.urgenceA_id.contact_id) {
        console.log("patchting formUrgenceAContact");
        this.formUrgenceA.patchValue({
          mobile_urgenceA: this.jeuneData.urgenceA_id.contact_id.mobile,
          fixe_urgenceA: this.jeuneData.urgenceA_id.contact_id.fixe

        })
      }
    }
    if (this.jeuneData.urgenceB_id) {
      console.log("patchting formUrgenceBID");
      this.UrgenceBControl.patchValue(this.jeuneData.urgenceB_id.nom + " " + this.jeuneData.urgenceB_id.prenom);
      this.formUrgenceB.patchValue({
        nom_urgenceB: this.jeuneData.urgenceB_id.nom,
        prenom_urgenceB: this.jeuneData.urgenceB_id.prenom
      });
      if (this.jeuneData.urgenceB_id.contact_id) {
        console.log("patchting formUrgenceBContact");
        this.formUrgenceB.patchValue({
          mobile_urgenceB: this.jeuneData.urgenceB_id.contact_id.mobile,
          fixe_urgenceB: this.jeuneData.urgenceB_id.contact_id.fixe

        })
      }
    }
    console.log("patched")
  }



  toggleJeuneEditMode() {
    this.jeuneEditMode = !this.jeuneEditMode;
    if (this.jeuneEditMode) {
      this.formJeune.enable();
    } else {
      this.formJeune.disable();
      this.resetData();
    }
  }
  toggleFamilleEditMode() {
    this.familleEditMode = !this.familleEditMode;
    if (this.familleEditMode) {
      this.formFamille.enable();
    } else {
      this.formFamille.disable();
      this.resetData();
    }
  }
  toggleParentAEditMode() {
    if (this.jeuneData.famille_id.id != null) {
      this.parentAEditMode = !this.parentAEditMode;
      if (this.parentAEditMode) {
        this.formParentA.enable();
      } else {
        this.formParentA.disable();
        this.resetData();
      }
    }
  }
  toggleParentBEditMode() {
    if (this.jeuneData.famille_id.id != null) {
      this.parentBEditMode = !this.parentBEditMode;
      if (this.parentBEditMode) {
        this.formParentB.enable();
      } else {
        this.formParentB.disable();
        this.resetData();
      }
    }

  }
  toggleAccompagnateurAEditMode() {
    this.accompagnateurAEditMode = !this.accompagnateurAEditMode;
    if (this.accompagnateurAEditMode) {
      this.formAccompagnateurA.enable();
    } else {
      this.formAccompagnateurA.disable();
      this.resetData();
    }
  }

  toggleAccompagnateurBEditMode() {
    this.accompagnateurBEditMode = !this.accompagnateurBEditMode;
    if (this.accompagnateurBEditMode) {
      this.formAccompagnateurB.enable();
    } else {
      this.formAccompagnateurB.disable();
      this.resetData();
    }
  }
  toggleUrgenceAEditMode() {
    this.urgenceAEditMode = !this.urgenceAEditMode;
    if (this.urgenceAEditMode) {
      this.formUrgenceA.enable();
    } else {
      this.formUrgenceA.disable();
      this.resetData();
    }
  }

  toggleUrgenceBEditMode() {
    this.urgenceBEditMode = !this.urgenceBEditMode;
    if (this.urgenceBEditMode) {
      this.formUrgenceB.enable();
    } else {
      this.formUrgenceB.disable();
      this.resetData();
    }
  }


  toggleProfEditMode() {
    this.profEditMode = !this.profEditMode;
    if (this.profEditMode) {
      this.formProf.enable();
    } else {
      this.formProf.disable();
      this.resetData();
    }
  }

  resetData() {
    this.jeuneData = structuredClone(this.jeuneOriginalData);
    this.patchValue();
  }
  async updateJeuneTable() {
    if (this.jeuneOriginalData.id == null) {
      console.log("inserting table Jeune id+contact+jeune");
      this.jeuneData.identite_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.identite_id.contact_id)).id;
      this.jeuneData.identite_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.identite_id)).id;
      this.jeuneData.id = (await this.supabaseService.insertJeunesseData(this.jeuneData)).id;
    }
    else if (this.jeuneOriginalData.identite_id.id == null) {
      console.log("inserting table Jeune id+contact");
      this.jeuneData.identite_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.identite_id.contact_id)).id;
      this.jeuneData.identite_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.identite_id)).id;
    }
    else if (this.jeuneOriginalData.identite_id.contact_id.id == null) {
      console.log("inserting table Jeune contact");
      this.jeuneData.identite_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.identite_id.contact_id)).id;
    }
    console.log("updating table Jeune id+contact+jeune");
    console.log(this.jeuneData);
    this.supabaseService.updateContactData(this.jeuneData.identite_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.identite_id)
    this.supabaseService.updateJeunesseData(this.jeuneData);
    console.log("jeune saved:", this.jeuneData);
  }
  async updateProfTable() {
    if (this.jeuneData.prof_principale_id.id == null) {
      console.log("inserting table Prof id+contact");
      this.jeuneData.prof_principale_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.prof_principale_id.contact_id)).id;
      this.jeuneData.prof_principale_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.prof_principale_id)).id;
    }
    else if (this.jeuneData.prof_principale_id.contact_id.id == null) {
      console.log("inserting table Prof contact");
      this.jeuneData.prof_principale_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.prof_principale_id.contact_id)).id;
    }
    console.log("updating table Prof id+contact && table jeune");
    this.supabaseService.updateContactData(this.jeuneData.prof_principale_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.prof_principale_id)
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.patchValue();

  }
  async updateAccompagnateurATable() {
    if (this.jeuneData.accompagnateurA_id.id == null) {
      console.log("inserting table accompagnateur A id+contact");
      this.jeuneData.accompagnateurA_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.accompagnateurA_id.contact_id)).id;
      this.jeuneData.accompagnateurA_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.accompagnateurA_id)).id;
    }
    else if (this.jeuneData.accompagnateurA_id.contact_id.id == null) {
      console.log("inserting table accompagnateur A contact");
      this.jeuneData.accompagnateurA_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.accompagnateurA_id.contact_id)).id;
    }
    console.log("updating table accompagnateur A id+contact && table jeune");
    this.supabaseService.updateContactData(this.jeuneData.accompagnateurA_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.accompagnateurA_id)
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.patchValue();

  }
  async updateAccompagnateurBTable() {
    if (this.jeuneData.accompagnateurB_id.id == null) {
      console.log("inserting table accompagnateur B id+contact");
      this.jeuneData.accompagnateurB_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.accompagnateurB_id.contact_id)).id;
      this.jeuneData.accompagnateurB_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.accompagnateurB_id)).id;
    }
    else if (this.jeuneData.accompagnateurB_id.contact_id.id == null) {
      console.log("inserting table accompagnateur B contact");
      this.jeuneData.accompagnateurB_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.accompagnateurB_id.contact_id)).id;
    }
    console.log("updating table accompagnateur B id+contact && table jeune");
    this.supabaseService.updateContactData(this.jeuneData.accompagnateurB_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.accompagnateurB_id)
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.patchValue();

  }
  async updateUrgenceATable() {
    if (this.jeuneData.urgenceA_id.id == null) {
      console.log("inserting table urgence A id+contact");
      this.jeuneData.urgenceA_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.urgenceA_id.contact_id)).id;
      this.jeuneData.urgenceA_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.urgenceA_id)).id;
    }
    else if (this.jeuneData.urgenceA_id.contact_id.id == null) {
      console.log("inserting table urgence A contact");
      this.jeuneData.urgenceA_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.urgenceA_id.contact_id)).id;
    }
    console.log("updating table urgence A id+contact && table jeune");
    this.supabaseService.updateContactData(this.jeuneData.urgenceA_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.urgenceA_id)
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.patchValue();

  }

  async updateUrgenceBTable() {
    if (this.jeuneData.urgenceB_id.id == null) {
      console.log("inserting table urgence B id+contact");
      this.jeuneData.urgenceB_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.urgenceB_id.contact_id)).id;
      this.jeuneData.urgenceB_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.urgenceB_id)).id;
    }
    else if (this.jeuneData.urgenceB_id.contact_id.id == null) {
      console.log("inserting table urgence B contact");
      this.jeuneData.urgenceB_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.urgenceB_id.contact_id)).id;
    }
    console.log("updating table urgence B id+contact && table jeune");
    this.supabaseService.updateContactData(this.jeuneData.urgenceB_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.urgenceB_id)
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.patchValue();

  }


  async updateJeuneFamilleTable() {
    if (this.jeuneData.famille_id.id == null) {
      console.log("inserting table famille");
      this.jeuneData.famille_id.id = (await this.supabaseService.insertFamilleData(this.jeuneData.famille_id)).id;
      this.parentAControl.enable();
      this.parentBControl.enable();
    }
    console.log("updating table famille && table jeune");
    this.supabaseService.updateFamilleData(this.jeuneData.famille_id);
    this.supabaseService.updateJeunesseData(this.jeuneData);
  }
  async updateParentATable() {
    if (this.jeuneData.famille_id.parentA_id.id == null) {
      console.log("inserting table Parent A id+contact");
      this.jeuneData.famille_id.parentA_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.famille_id.parentA_id.contact_id)).id;
      this.jeuneData.famille_id.parentA_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.famille_id.parentA_id)).id;
    }
    else if (this.jeuneData.famille_id.parentA_id.contact_id.id == null) {
      console.log("inserting table Parent A contact");
      this.jeuneData.famille_id.parentA_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.famille_id.parentA_id.contact_id)).id;
    }
    console.log("updating table ParentA id+contact && table famille && table jeune")
    this.supabaseService.updateContactData(this.jeuneData.famille_id.parentA_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.famille_id.parentA_id);
    this.supabaseService.updateFamilleData(this.jeuneData.famille_id);
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.patchValue();
  }
  async updateParentBTable() {
    console.log("updating parentB table");
    if (this.jeuneData.famille_id.parentB_id.id == null) {
      console.log("inserting table Parent B id+contact");
      this.jeuneData.famille_id.parentB_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.famille_id.parentB_id.contact_id)).id;
      this.jeuneData.famille_id.parentB_id.id = (await this.supabaseService.insertIdentiteData(this.jeuneData.famille_id.parentB_id)).id;
    }
    else if (this.jeuneData.famille_id.parentB_id.contact_id.id == null) {
      console.log("inserting table Parent B contact");
      this.jeuneData.famille_id.parentB_id.contact_id.id = (await this.supabaseService.insertContactData(this.jeuneData.famille_id.parentB_id.contact_id)).id;
    }
    console.log("updating table ParentB id+contact && table famille && table jeune")
    this.supabaseService.updateContactData(this.jeuneData.famille_id.parentB_id.contact_id);
    this.supabaseService.updateIdentiteData(this.jeuneData.famille_id.parentB_id);
    this.supabaseService.updateFamilleData(this.jeuneData.famille_id);
    this.supabaseService.updateJeunesseData(this.jeuneData);
    this.patchValue();
  }

  updateJeuneData() {

    console.log("updating data 1");
    this.jeuneData.classe = this.formJeune.controls['classe'].value;
    this.jeuneData.ecole = this.formJeune.controls['ecole'].value;
    this.jeuneData.scholarite = this.formJeune.controls['scholarite'].value;
    this.jeuneData.scholarite_france = this.formJeune.controls['scholarite_france'].value;
    this.jeuneData.autorisation_medical = this.formJeune.controls['autorisation_medical'].value;
    this.jeuneData.autorisation_photo = this.formJeune.controls['autorisation_photo'].value;
    this.jeuneData.autorisation_sortie = this.formJeune.controls['autorisation_sortie'].value;


    console.log(this.jeuneData);
    if (this.jeuneData.identite_id) {
      // Update only the values in identite_id that are managed by the form
      this.jeuneData.identite_id.nom = this.formJeune.controls['nom_jeune'].value;
      this.jeuneData.identite_id.prenom = this.formJeune.controls['prenom_jeune'].value;
      this.jeuneData.identite_id.date_naissance = this.formJeune.controls['date_naissance_jeune'].value;
      this.jeuneData.identite_id.date_naissance.setDate(this.jeuneData.identite_id.date_naissance.getDate()+1);
      this.jeuneData.identite_id.nationalite = this.formJeune.controls['nationalite_jeune'].value;
      this.jeuneData.identite_id.genre = this.formJeune.controls['genre_jeune'].value;
      if (this.jeuneData.identite_id.contact_id) {
        this.jeuneData.identite_id.contact_id.mobile = this.formJeune.controls['mobile_jeune'].value;
        this.jeuneData.identite_id.contact_id.fixe = this.formJeune.controls['fixe_jeune'].value;
        this.jeuneData.identite_id.contact_id.mail = this.formJeune.controls['mail_jeune'].value;
        this.jeuneData.identite_id.contact_id.adresse = this.formJeune.controls['adresse_jeune'].value;
      }
    }
    console.log("updating data 2");
    if (this.jeuneData.famille_id) {
      this.jeuneData.famille_id.nom = this.formFamille.controls['nom_famille'].value;
      if (this.jeuneData.famille_id.parentA_id) {
        this.jeuneData.famille_id.parentA_id.nom = this.formParentA.controls['nom_parentA'].value;
        this.jeuneData.famille_id.parentA_id.prenom = this.formParentA.controls['prenom_parentA'].value;
        if (this.jeuneData.famille_id.parentA_id.contact_id) {
          this.jeuneData.famille_id.parentA_id.contact_id.mobile = this.formParentA.controls['mobile_parentA'].value;
          this.jeuneData.famille_id.parentA_id.contact_id.fixe = this.formParentA.controls['fixe_parentA'].value;
          this.jeuneData.famille_id.parentA_id.contact_id.mail = this.formParentA.controls['mail_parentA'].value;
          this.jeuneData.famille_id.parentA_id.contact_id.adresse = this.formParentA.controls['adresse_parentA'].value;
        }

      }

      if (this.jeuneData.famille_id.parentB_id) {
        this.jeuneData.famille_id.parentB_id.nom = this.formParentB.controls['nom_parentB'].value;
        this.jeuneData.famille_id.parentB_id.prenom = this.formParentB.controls['prenom_parentB'].value;
        if (this.jeuneData.famille_id.parentB_id.contact_id) {
          this.jeuneData.famille_id.parentB_id.contact_id.mobile = this.formParentB.controls['mobile_parentB'].value;
          this.jeuneData.famille_id.parentB_id.contact_id.fixe = this.formParentB.controls['fixe_parentB'].value;
          this.jeuneData.famille_id.parentB_id.contact_id.mail = this.formParentB.controls['mail_parentB'].value;
          this.jeuneData.famille_id.parentB_id.contact_id.adresse = this.formParentB.controls['adresse_parentB'].value;
        }

      }

    }
    if (this.jeuneData.prof_principale_id) {
      this.jeuneData.prof_principale_id.nom = this.formProf.controls['nom_prof_principale'].value;
      this.jeuneData.prof_principale_id.prenom = this.formProf.controls['prenom_prof_principale'].value;
      if (this.jeuneData.prof_principale_id.contact_id) {
        this.jeuneData.prof_principale_id.contact_id.mobile = this.formProf.controls['mobile_prof_principale'].value;
        this.jeuneData.prof_principale_id.contact_id.fixe = this.formProf.controls['fixe_prof_principale'].value;
        this.jeuneData.prof_principale_id.contact_id.mail = this.formProf.controls['mail_prof_principale'].value;
        this.jeuneData.prof_principale_id.contact_id.adresse = this.formProf.controls['adresse_prof_principale'].value;
      }

    }

    console.log("updating data 3");
    if (this.jeuneData.accompagnateurA_id) {
      this.jeuneData.accompagnateurA_id.nom = this.formAccompagnateurA.controls['nom_accompagnateurA'].value;
      this.jeuneData.accompagnateurA_id.prenom = this.formAccompagnateurA.controls['prenom_accompagnateurA'].value;
      if (this.jeuneData.accompagnateurA_id.contact_id) {
        this.jeuneData.accompagnateurA_id.contact_id.mobile = this.formAccompagnateurA.controls['mobile_accompagnateurA'].value;
        this.jeuneData.accompagnateurA_id.contact_id.fixe = this.formAccompagnateurA.controls['fixe_accompagnateurA'].value;
      }

    }

    console.log("updating data 4");
    if (this.jeuneData.accompagnateurB_id) {
      this.jeuneData.accompagnateurB_id.nom = this.formAccompagnateurB.controls['nom_accompagnateurB'].value;
      this.jeuneData.accompagnateurB_id.prenom = this.formAccompagnateurB.controls['prenom_accompagnateurB'].value;
      if (this.jeuneData.accompagnateurB_id.contact_id) {
        this.jeuneData.accompagnateurB_id.contact_id.mobile = this.formAccompagnateurB.controls['mobile_accompagnateurB'].value;
        this.jeuneData.accompagnateurB_id.contact_id.fixe = this.formAccompagnateurB.controls['fixe_accompagnateurB'].value;
      }

    }

    if (this.jeuneData.urgenceA_id) {
      this.jeuneData.urgenceA_id.nom = this.formUrgenceA.controls['nom_urgenceA'].value;
      this.jeuneData.urgenceA_id.prenom = this.formUrgenceA.controls['prenom_urgenceA'].value;
      if (this.jeuneData.urgenceA_id.contact_id) {
        this.jeuneData.urgenceA_id.contact_id.mobile = this.formUrgenceA.controls['mobile_urgenceA'].value;
        this.jeuneData.urgenceA_id.contact_id.fixe = this.formUrgenceA.controls['fixe_urgenceA'].value;
      }

    }

    if (this.jeuneData.urgenceB_id) {
      this.jeuneData.urgenceB_id.nom = this.formUrgenceB.controls['nom_urgenceB'].value;
      this.jeuneData.urgenceB_id.prenom = this.formUrgenceB.controls['prenom_urgenceB'].value;
      if (this.jeuneData.urgenceB_id.contact_id) {
        this.jeuneData.urgenceB_id.contact_id.mobile = this.formUrgenceB.controls['mobile_urgenceB'].value;
        this.jeuneData.urgenceB_id.contact_id.fixe = this.formUrgenceB.controls['fixe_urgenceB'].value;
      }

    }
    // Update only prof_principale_id fields that are managed by the form

    console.log("updated jeune", this.jeuneData);
  }

  saveJeuneData() {
    console.log("saving Jeune");
    if (!this.jeuneEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateJeuneTable();
    this.jeuneEditMode = !this.jeuneEditMode;
    this.formJeune.disable();
    this.jeuneOriginalData = this.jeuneData;
  }
  saveProfData() {
    console.log("saving prof");
    if (!this.profEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateProfTable();
    this.profEditMode = !this.profEditMode;
    this.formProf.disable();
    this.jeuneOriginalData.prof_principale_id = this.jeuneData.prof_principale_id;
  }
  saveAccompagnateurAData() {
    console.log("saving AccompagnateurA");
    if (!this.accompagnateurAEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateAccompagnateurATable();
    this.accompagnateurAEditMode = !this.accompagnateurAEditMode;
    this.formAccompagnateurA.disable();
    this.jeuneOriginalData.accompagnateurA_id = this.jeuneData.accompagnateurA_id;

  }
  saveAccompagnateurBData() {
    console.log("saving AccompagnateurB");
    if (!this.accompagnateurBEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateAccompagnateurBTable();
    this.accompagnateurBEditMode = !this.accompagnateurBEditMode;
    this.formAccompagnateurB.disable();
    this.jeuneOriginalData.accompagnateurB_id = this.jeuneData.accompagnateurB_id;
  }
  saveUrgenceAData() {
    console.log("saving urgenceA");
    if (!this.urgenceAEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateUrgenceATable();
    this.urgenceAEditMode = !this.urgenceAEditMode;
    this.formUrgenceA.disable();
    this.jeuneOriginalData.urgenceA_id = this.jeuneData.urgenceA_id;
  }
  saveUrgenceBData() {
    console.log("saving urgenceB");
    if (!this.urgenceBEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateUrgenceBTable();
    this.urgenceBEditMode = !this.urgenceBEditMode;
    this.formUrgenceB.disable();
    this.jeuneOriginalData.urgenceB_id = this.jeuneData.urgenceB_id;
  }
  saveFamilleData() {
    console.log("saving Famille");
    if (!this.familleEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateJeuneFamilleTable();
    this.familleEditMode = !this.familleEditMode;
    this.formFamille.disable();
    this.jeuneOriginalData.famille_id = this.jeuneData.famille_id;
  }
  saveParentAData() {
    console.log("saving ParentA");
    if (!this.parentAEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateParentATable();
    this.parentAEditMode = !this.parentAEditMode;
    this.formParentA.disable();
    this.jeuneOriginalData.famille_id.parentA_id = this.jeuneData.famille_id.parentA_id;
  }
  saveParentBData() {
    console.log("saving ParentB");
    if (!this.parentBEditMode) {
      return;
    }
    this.updateJeuneData();
    this.updateParentBTable();
    this.parentBEditMode = !this.parentBEditMode;
    this.formParentB.disable();
    this.jeuneOriginalData.famille_id.parentB_id = this.jeuneData.famille_id.parentB_id;

  }


  addParentA(inputNomPrenom: string) {
    console.log("checking name");
    let nomPrenom = inputNomPrenom.split(" ");
    for (let i = 0; i < this.identiteList.length; i++) {
      console.log(nomPrenom[0], this.identiteList[i].nom, nomPrenom[1], this.identiteList[i].prenom);
      if (this.identiteList[i].nom == nomPrenom[0]) {
        if (this.identiteList[i].prenom == nomPrenom[1]) {
          console.log("found name", this.identiteList[i].nom);
          this.jeuneData.famille_id.parentA_id = this.identiteList[i];
          this.jeuneOriginalData.famille_id.parentA_id = this.identiteList[i];
          console.log(this.jeuneData.famille_id.parentA_id);
          this.updateParentATable();
          this.patchValue();
          this.parentAEditMode = !this.parentAEditMode;
          this.formParentA.disable();
          this.parentAEditMode = false;
        }
      }
    }

  }
  addParentB(inputNomPrenom: string) {
    console.log("checking name");
    let nomPrenom = inputNomPrenom.split(" ");
    for (let i = 0; i < this.identiteList.length; i++) {
      console.log(nomPrenom[0], this.identiteList[i].nom, nomPrenom[1], this.identiteList[i].prenom);
      if (this.identiteList[i].nom == nomPrenom[0]) {
        if (this.identiteList[i].prenom == nomPrenom[1]) {
          console.log("found name", this.identiteList[i].nom);
          this.jeuneData.famille_id.parentB_id = this.identiteList[i];
          this.jeuneOriginalData.famille_id.parentB_id = this.identiteList[i];
          this.updateParentBTable();
          this.patchValue();
          this.formParentB.disable();
          this.parentBEditMode = false;

        }
      }
    }

  }

  addProf(inputNomPrenom: string) {
    console.log("checking name");
    let nomPrenom = inputNomPrenom.split(" ");
    for (let i = 0; i < this.identiteList.length; i++) {
      console.log(nomPrenom[0], this.identiteList[i].nom, nomPrenom[1], this.identiteList[i].prenom);
      if (this.identiteList[i].nom == nomPrenom[0]) {
        if (this.identiteList[i].prenom == nomPrenom[1]) {
          console.log("found name", this.identiteList[i].nom);
          this.jeuneData.prof_principale_id = this.identiteList[i];
          this.jeuneOriginalData.prof_principale_id = this.identiteList[i];
          this.updateProfTable();
          this.patchValue();
          this.formProf.disable();
          this.profEditMode = false;
        }
      }
    }

  }

  addFamille(inputFamille: string) {
    for (let i = 0; i < this.familleList.length; i++) {
      if (this.familleList[i].nom == inputFamille) {
        this.jeuneData.famille_id = this.familleList[i];
        this.jeuneOriginalData.famille_id = this.familleList[i];
        this.updateJeuneFamilleTable();
        this.patchValue();
        this.formFamille.disable();
        this.familleEditMode = false;
      }
    }
  }

  addAccompagnateurA(inputNomPrenom: string) {
    console.log("checking name");
    let nomPrenom = inputNomPrenom.split(" ");
    for (let i = 0; i < this.identiteList.length; i++) {
      if (this.identiteList[i].nom == nomPrenom[0]) {
        if (this.identiteList[i].prenom == nomPrenom[1]) {
          console.log("found name", this.identiteList[i].nom);
          this.jeuneData.accompagnateurA_id = this.identiteList[i];
          this.patchValue();
          this.updateAccompagnateurATable();
          this.formAccompagnateurA.disable();
          this.accompagnateurAEditMode = false;
          this.jeuneOriginalData.accompagnateurA_id = this.jeuneData.accompagnateurA_id;
        }
      }
    }
  }

  addAccompagnateurB(inputNomPrenom: string) {
    console.log("checking name");
    let nomPrenom = inputNomPrenom.split(" ");
    for (let i = 0; i < this.identiteList.length; i++) {
      if (this.identiteList[i].nom == nomPrenom[0]) {
        if (this.identiteList[i].prenom == nomPrenom[1]) {
          console.log("found name", this.identiteList[i].nom);
          this.jeuneData.accompagnateurB_id = this.identiteList[i];
          this.patchValue();
          this.updateAccompagnateurBTable();
          this.formAccompagnateurB.disable();
          this.accompagnateurBEditMode = false;
          this.jeuneOriginalData.accompagnateurB_id = this.jeuneData.accompagnateurB_id;
        }
      }
    }
  }
  addUrgenceA(inputNomPrenom: string) {
    console.log("checking name");
    let nomPrenom = inputNomPrenom.split(" ");
    for (let i = 0; i < this.identiteList.length; i++) {
      if (this.identiteList[i].nom == nomPrenom[0]) {
        if (this.identiteList[i].prenom == nomPrenom[1]) {
          console.log("found name", this.identiteList[i].nom);
          this.jeuneData.urgenceA_id = this.identiteList[i];
          this.patchValue();
          this.updateUrgenceATable();
          this.formUrgenceA.disable();
          this.urgenceAEditMode = false;
          this.jeuneOriginalData.urgenceA_id = this.jeuneData.urgenceA_id;
        }
      }
    }
  }

  addUrgenceB(inputNomPrenom: string) {
    console.log("checking name");
    let nomPrenom = inputNomPrenom.split(" ");
    for (let i = 0; i < this.identiteList.length; i++) {
      if (this.identiteList[i].nom == nomPrenom[0]) {
        if (this.identiteList[i].prenom == nomPrenom[1]) {
          console.log("found name", this.identiteList[i].nom);
          this.jeuneData.urgenceB_id = this.identiteList[i];
          this.patchValue();
          this.updateUrgenceBTable();
          this.formUrgenceB.disable();
          this.urgenceBEditMode = false;
          this.jeuneOriginalData.urgenceB_id = this.jeuneData.urgenceB_id;
        }
      }
    }
  }

  mergeJeuneData() {
    if (this.jeuneOriginalData.identite_id) {
      if (this.jeuneOriginalData.identite_id.contact_id) {
        this.jeuneOriginalData.identite_id.contact_id = this.jeuneData.identite_id.contact_id;
      } else {
        this.jeuneOriginalData.identite_id.contact_id = this.jeuneData.identite_id.contact_id;
      }
    } else {
      this.jeuneOriginalData.identite_id = this.jeuneData.identite_id;
    }
  
    if (this.jeuneOriginalData.accompagnateurA_id) {
      if (this.jeuneOriginalData.accompagnateurA_id.contact_id) {
        this.jeuneOriginalData.accompagnateurA_id.contact_id = this.jeuneData.accompagnateurA_id.contact_id;
      } else {
        this.jeuneOriginalData.accompagnateurA_id.contact_id = this.jeuneData.accompagnateurA_id.contact_id;
      }
    } else {
      this.jeuneOriginalData.accompagnateurA_id = this.jeuneData.accompagnateurA_id;
    }
  
    if (this.jeuneOriginalData.accompagnateurB_id) {
      if (this.jeuneOriginalData.accompagnateurB_id.contact_id) {
        this.jeuneOriginalData.accompagnateurB_id.contact_id = this.jeuneData.accompagnateurB_id.contact_id;
      } else {
        this.jeuneOriginalData.accompagnateurB_id.contact_id = this.jeuneData.accompagnateurB_id.contact_id;
      }
    } else {
      this.jeuneOriginalData.accompagnateurB_id = this.jeuneData.accompagnateurB_id;
    }
  
    if (this.jeuneOriginalData.urgenceA_id) {
      if (this.jeuneOriginalData.urgenceA_id.contact_id) {
        this.jeuneOriginalData.urgenceA_id.contact_id = this.jeuneData.urgenceA_id.contact_id;
      } else {
        this.jeuneOriginalData.urgenceA_id.contact_id = this.jeuneData.urgenceA_id.contact_id;
      }
    } else {
      this.jeuneOriginalData.urgenceA_id = this.jeuneData.urgenceA_id;
    }
  
    if (this.jeuneOriginalData.urgenceB_id) {
      if (this.jeuneOriginalData.urgenceB_id.contact_id) {
        this.jeuneOriginalData.urgenceB_id.contact_id = this.jeuneData.urgenceB_id.contact_id;
      } else {
        this.jeuneOriginalData.urgenceB_id.contact_id = this.jeuneData.urgenceB_id.contact_id;
      }
    } else {
      this.jeuneOriginalData.urgenceB_id = this.jeuneData.urgenceB_id;
    }
  
    if (this.jeuneOriginalData.famille_id) {
      if (this.jeuneOriginalData.famille_id.parentA_id) {
        if (this.jeuneOriginalData.famille_id.parentA_id.contact_id) {
          this.jeuneOriginalData.famille_id.parentA_id.contact_id = this.jeuneData.famille_id.parentA_id.contact_id;
        } else {
          this.jeuneOriginalData.famille_id.parentA_id.contact_id = this.jeuneData.famille_id.parentA_id.contact_id;
        }
      } else {
        this.jeuneOriginalData.famille_id.parentA_id = this.jeuneData.famille_id.parentA_id;
      }
  
      if (this.jeuneOriginalData.famille_id.parentB_id) {
        if (this.jeuneOriginalData.famille_id.parentB_id.contact_id) {
          this.jeuneOriginalData.famille_id.parentB_id.contact_id = this.jeuneData.famille_id.parentB_id.contact_id;
        } else {
          this.jeuneOriginalData.famille_id.parentB_id.contact_id = this.jeuneData.famille_id.parentB_id.contact_id;
        }
      } else {
        this.jeuneOriginalData.famille_id.parentB_id = this.jeuneData.famille_id.parentB_id;
      }
    } else {
      this.parentAControl.disable();
      this.parentBControl.disable();
      this.jeuneOriginalData.famille_id = this.jeuneData.famille_id;
    }
  
    if (this.jeuneOriginalData.prof_principale_id) {
      if (this.jeuneOriginalData.prof_principale_id.contact_id) {
        this.jeuneOriginalData.prof_principale_id.contact_id = this.jeuneData.prof_principale_id.contact_id;
      } else {
        this.jeuneOriginalData.prof_principale_id.contact_id = this.jeuneData.prof_principale_id.contact_id;
      }
    } else {
      this.jeuneOriginalData.prof_principale_id = this.jeuneData.prof_principale_id;
    }
  
    // Merging root-level fields
    this.jeuneData = this.jeuneOriginalData;
  }
  

  goBack() {
    this.router.navigate(['jeunesse']);
  }


}

