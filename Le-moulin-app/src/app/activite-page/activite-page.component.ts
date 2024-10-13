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
import { Event } from '../entities/event.entite';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Activite } from '../entities/activite.entite';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SelectionModel } from '@angular/cdk/collections';
import { createClient } from '@supabase/supabase-js';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TestBed } from '@angular/core/testing';
import { Participant } from '../entities/participant.entite';
import { find } from 'rxjs';



export interface eventTableRow {
  id_event: number;
  date: Date;
  jour: string;
  inscrit_event: number;
  participation_event: number;
}
export interface inscritTableRow {
  id_inscrit: number;
  nom: string;
  prenom: string;
  inscrit_inscrit: number;
  participation_inscrit: number;
}

@Component({
  selector: 'app-activite-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSidenavModule,
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
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  providers: [SupabaseService, provideNativeDateAdapter()],
  templateUrl: './activite-page.component.html',
  styleUrl: './activite-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitePageComponent implements OnInit {

  eventDataSource: MatTableDataSource<eventTableRow>;
  eventSelection: SelectionModel<eventTableRow>;
  inscritDataSource: MatTableDataSource<inscritTableRow>;
  inscritSelection: SelectionModel<inscritTableRow>;

  @ViewChild(MatPaginator) paginatorEvent: MatPaginator;
  @ViewChild(MatSort) sortEvent: MatSort;

  @ViewChild(MatPaginator) paginatorInscrit: MatPaginator;
  @ViewChild(MatSort) sortInscrit: MatSort;

  @ViewChild('nomPrenom') nomPrenom: ElementRef<HTMLInputElement>;
  optionsIdentite: string[] = [''];
  filteredOptionsIdentite: string[];

  jourSemaine = ['lundi', 'mardi', 'mecredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly supabaseService: SupabaseService,
  ) {
    this.filteredOptionsIdentite = this.optionsIdentite.slice();
  }
  filterNomPrenom(): void {
    const filterNomPrenomValue = this.nomPrenom.nativeElement.value.toLowerCase();
    this.filteredOptionsIdentite = this.optionsIdentite.filter(o => o.toLowerCase().includes(filterNomPrenomValue));

  }
  identiteList: Identite[];
  jeuneList: Jeune[];

  inscritList: Participant[];
  inscritListOfRows: inscritTableRow[] = [];
  eventList: Event[];
  eventListOfRows: eventTableRow[] = [];


  activiteData: Activite;
  activiteOriginalData: Activite;

  nomPrenomControl = new FormControl('');

  formActivite: FormGroup;
  activiteEditMode = false;

  startDateYear: Date;
  endDateYear: Date;
  formSelectionDate: FormGroup;

  id: number;

  ngOnInit(): void {

    this.startDateYear = new Date(new Date().getFullYear(), 0, 1)
    this.endDateYear = new Date(new Date().getFullYear(), 11, 31)


    this.formActivite = new FormGroup({
      nom: new FormControl(''),
      secteur: new FormControl(''),
      enfant: new FormControl(true),
      adulte: new FormControl(true),
    });

    this.formActivite.disable();

    this.formSelectionDate = new FormGroup({
      start: new FormControl<Date | null>(this.startDateYear),
      end: new FormControl<Date | null>(this.endDateYear),
      lundi: new FormControl(true),
      mardi: new FormControl(true),
      mercredi: new FormControl(true),
      jeudi: new FormControl(true),
      vendredi: new FormControl(true),
      samedi: new FormControl(true),
      dimanche: new FormControl(true),
    })

    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      this.identiteList = await this.supabaseService.fetchIdentiteData();
      this.jeuneList = await this.supabaseService.fetchJeunesseData();
      this.activiteOriginalData = await this.supabaseService.fetchActiviteDataById(params['id']);
      this.activiteData = structuredClone(this.activiteOriginalData);
      this.updateDataSources();
      this.patchValue();
      this.fillIdentiteOptionList();
    })
    
    
  }
  displayedEventColumns: string[] = ['date', 'jour', 'inscrit_event', 'participation_event', 'select'];
  displayedInscritColumns: string[] = ['nom', 'prenom', 'inscrit_inscrit', 'participation_inscrit', 'select'];
  
  async updateDataSources(){
    this.eventList = await this.supabaseService.fetchEventDataByActiviteId(this.activiteData.id);
    for (let i = 0; i < this.eventList.length; i++) {
      let participantList: Participant[] = await this.supabaseService.fetchParticipantDataByEventId(this.eventList[i].id)
  
      let id_event = this.eventList[i].id;
      let date = this.eventList[i].date;
      let jour = this.jourSemaine[date.getDay()];
      let inscrit_event = participantList.length;
      let participation_event = 0;
  
      let found = false;
      for (let j = 0; j < inscrit_event; j++) {
        for (let k = 0; k < this.inscritListOfRows.length; k++) {
          if (this.inscritListOfRows[k].id_inscrit = participantList[j].id) {
            found = true;
            
            this.inscritListOfRows[k].inscrit_inscrit = this.inscritListOfRows[k].inscrit_inscrit + 1;
            if (participantList[j].presence == true) {
              participation_event = participation_event + 1;
              this.inscritListOfRows[k].participation_inscrit = this.inscritListOfRows[k].participation_inscrit + 1;
            }
          }
        }
        if (found == false) {
          let id_inscrit = participantList[j].id;
          let nom = participantList[j].idendite_id.nom;
          let prenom = participantList[j].idendite_id.prenom;
          let inscrit_inscrit = 1;
          let participation_inscrit = 0;
          if (participantList[j].presence == true) {
            participation_event = participation_event + 1;
            participation_inscrit = 1;
          }
          this.inscritListOfRows.push({ id_inscrit, nom, prenom, inscrit_inscrit, participation_inscrit });
        }
      }
      this.eventListOfRows.push({ id_event, date, jour, inscrit_event, participation_event });
    }
    this.eventDataSource = new MatTableDataSource(this.eventListOfRows);
    this.eventDataSource.filter = "";
    this.inscritDataSource = new MatTableDataSource(this.inscritListOfRows);
    this.inscritDataSource.filter = "";
    this.eventDataSource.paginator = this.paginatorEvent;
    this.inscritDataSource.paginator = this.paginatorInscrit;
    this.eventDataSource.sort = this.sortEvent;
    this.inscritDataSource.sort = this.sortInscrit;
  }


  applyInscritFilter() {

  }
  applyEventFilter() {

  }
  isAllInscritSelected() {
    const numSelected = this.inscritSelection.selected.length;
    const numRows = this.inscritDataSource.data.length;
    return numSelected === numRows;

  }
  isAllEventSelected() {
    const numSelected = this.eventSelection.selected.length;
    const numRows = this.eventDataSource.data.length;
    return numSelected === numRows;

  }
  toogleAllInscritRows() {
    if (this.isAllInscritSelected()) {
      this.inscritSelection.clear();
      return;
    }
    this.inscritSelection.select(...this.inscritDataSource.data);
  }

  toogleAllEventRows() {
    if (this.isAllEventSelected()) {
      this.eventSelection.clear();
      return;
    }
    this.eventSelection.select(...this.eventDataSource.data);

  }
  checkboxInscritLabel(row?: inscritTableRow): string {
    if (!row) {
      return `${this.isAllInscritSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.inscritSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_inscrit + 1}`;

  }
  checkboxEventLabel(row?: eventTableRow): string {
    if (!row) {
      return `${this.isAllEventSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.eventSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_event + 1}`;

  }

  fillIdentiteOptionList() {
    for (let i = 0; i < this.optionsIdentite.length; i++) {
      this.optionsIdentite.pop();
    }
    if (this.activiteData.adulte == true) {
      for (let i = 0; i < this.identiteList.length; i++) {
        let is_jeune = false;
        for (let j = 0; i < this.jeuneList.length; j++) {
          if (this.identiteList[i].id == this.jeuneList[j].identite_id.id) {
            is_jeune = true;
          }
        }
        if (this.activiteData.enfant == true || is_jeune == false) {
          this.optionsIdentite.push(this.identiteList[i].nom + " " + this.identiteList[i].prenom);
        }

      }
    }
    else if (this.activiteData.enfant == true) {
      for (let i = 0; i < this.jeuneList.length; i++) {
        this.optionsIdentite.push(this.jeuneList[i].identite_id.nom + " " + this.jeuneList[i].identite_id.prenom);
      }

    }

  }

  patchValue() {
    this.formActivite.patchValue({
      nom: this.activiteData.nom,
      secteur: this.activiteData.secteur,
      enfant: this.activiteData.enfant,
      adult: this.activiteData.adulte
    })
  }

  toggleActiviteEditMode() {
    this.activiteEditMode = !this.activiteEditMode;
    if (this.activiteEditMode) {
      this.formActivite.enable();
    } else {
      this.formActivite.disable();
      this.resetData();
    }
  }
  resetData() {
    this.activiteData = structuredClone(this.activiteOriginalData);
    this.patchValue();
  }
  updateActiviteData() {
    this.activiteData.nom = this.formActivite.controls["nom"].value;
    this.activiteData.secteur = this.formActivite.controls["secteur"].value;
    this.activiteData.adulte = this.formActivite.controls["adulte"].value;
    this.activiteData.enfant = this.formActivite.controls["enfant"].value;
  }


  saveActiviteData() {
    if (!this.activiteEditMode) {
      return;
    }
    this.updateActiviteData();
    this.supabaseService.updateActiviteData(this.activiteData);
    this.activiteEditMode = !this.activiteEditMode;
    this.formActivite.disable();
    this.activiteOriginalData = structuredClone(this.activiteData);
  }

  ajouterEvent() {
    let startDate = this.formSelectionDate.controls['start'].value;
    let endDate = this.formSelectionDate.controls['start'].value;
    let lundi = this.formSelectionDate.controls['lundi'].value;
    let mardi = this.formSelectionDate.controls['mardi'].value;
    let mercredi = this.formSelectionDate.controls['mercredi'].value;
    let jeudi = this.formSelectionDate.controls['jeudi'].value;
    let vendredi = this.formSelectionDate.controls['vendredi'].value;
    let samedi = this.formSelectionDate.controls['samedi'].value;
    let dimanche = this.formSelectionDate.controls['dimanche'].value;

    if (startDate != '') {
      let date = startDate;
      let event: Event = {
        id: null,
        activite_id: this.activiteData.id,
        date: date
      }
      //this.supabaseService.insertEventData(event);
      if (endDate != '') {
        let timeDifference = endDate.getTime() - startDate.getTime();
        let dayDifference = timeDifference / (1000 * 3600 * 24);
        if (dayDifference > 0) {
          for (let i = 1; i < dayDifference; i++) {
            date.setDate(date.getDate()+1)
            event.date = date;
            if(lundi == true && date.getDay() == 1){
             // this.supabaseService.insertEventData(event);
            }
            if(mardi == true && date.getDay() == 2){
              //this.supabaseService.insertEventData(event);
              
            }
            if(mercredi == true && date.getDay() == 3){
              //this.supabaseService.insertEventData(event);

            }
            if(jeudi == true && date.getDay() == 4){
              //this.supabaseService.insertEventData(event);
              
            }
            if(vendredi == true && date.getDay() == 5){
              //this.supabaseService.insertEventData(event);
              
            }
            if(samedi == true && date.getDay() == 6){
              //this.supabaseService.insertEventData(event);
              
            }
            if(dimanche == true && date.getDay() == 0){
              //this.supabaseService.insertEventData(event);
              
            }
          }

        }
      }
    }
    this.updateDataSources();
  }
  supprimerEvent() {

  }

  inscrireJeune() {
    console.log("inscrire jeune");
  }
  desincrireJeune() {

  }
  goToJeunePage(idJeune: string) {
    console.log("goToJeunePage", idJeune)
    this.router.navigate([`/jeunesse/${idJeune}`]);
  }
  goToEventPage(idEvent: string) {
    console.log("goToJeunePage", idEvent)
    this.router.navigate([`/activités/event/${idEvent}`]);
  }

  goBack() {
    this.router.navigate(['activités']);
  }

}
