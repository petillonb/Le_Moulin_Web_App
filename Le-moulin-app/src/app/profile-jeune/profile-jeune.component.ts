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
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      mobile: new FormControl(''),
      fixe: new FormControl(''),
      mail: new FormControl(''),
      adresse: new FormControl(''),
    });
  
    
    this.route.params.subscribe(async (params) => {
      this.jeuneOriginalData = await this.supabaseService.fetchJeunesseDataById(params['id']);
      this.jeuneData = structuredClone(this.jeuneOriginalData);
      this.form.patchValue(this.jeuneData);
      this.id = params['id'];
    })
    
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
    this.form.patchValue(this.jeuneData);
  }

  saveData() {
    if (!this.editMode) {
      return;
    }
    this.jeuneData = this.form.value;
    this.supabaseService.updateJeunesseData(this.jeuneData, this.id );
    console.log(this.id);
    console.log("saved");
    this.editMode = !this.editMode;
    this.form.disable();
    
  }
  

  goBack() {
    this.router.navigate(['jeunesse']);
  }


}
