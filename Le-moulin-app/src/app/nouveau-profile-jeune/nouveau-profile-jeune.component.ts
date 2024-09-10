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
  selector: 'app-nouveau-profile-jeune',
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
  templateUrl: './nouveau-profile-jeune.component.html',
  styleUrl: './nouveau-profile-jeune.component.scss'
})
export class NouveauProfileJeuneComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly supabaseService: SupabaseService,


  ) { }
  disabled = model(false);
  jeuneData: Jeune;
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
  
    
  }
  saveData() {

    this.jeuneData = this.form.value;
    this.supabaseService.insertJeunesseData(this.jeuneData);
    console.log("saved");
    //this.router.navigate(['jeunesse/',this.id]);
  
  }
  

  goBack() {
    this.router.navigate(['jeunesse']);
  }


}
