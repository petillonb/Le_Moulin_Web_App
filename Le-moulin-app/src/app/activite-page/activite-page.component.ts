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
import { EventActivite } from '../entities/event.entite';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';



export interface eventTableRow {
  id_event: number;
  date: string;
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
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule
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

  init = true;
  eventLoading: boolean;


  @ViewChild(MatPaginator) paginatorEvent: MatPaginator;
  @ViewChild(MatSort) sortEvent: MatSort;

  @ViewChild(MatPaginator) paginatorInscrit: MatPaginator;
  @ViewChild(MatSort) sortInscrit: MatSort;

  @ViewChild('nomPrenom') nomPrenom: ElementRef<HTMLInputElement>;

  optionsIdentite: string[] = [''];
  filteredOptionsIdentite: string[];

  jourSemaine = ['dimanche', 'lundi', 'mardi', 'mecredi', 'jeudi', 'vendredi', 'samedi']

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

  inscritList: Participant[] = [];
  inscritListOfRows: inscritTableRow[] = [];
  eventList: EventActivite[] = [];
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

  async ngOnInit() {


    this.eventLoading = true;

    this.startDateYear = new Date(new Date().getFullYear(), 0, 1)
    this.endDateYear = new Date(new Date().getFullYear(), 11, 31)





    this.formActivite = new FormGroup({
      nom: new FormControl(''),
      secteur: new FormControl(''),
      enfant: new FormControl(false),
      adulte: new FormControl(false),
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
      await this.updateDataSources();
      console.log("eventDataSource", this.eventDataSource);
      this.patchValue();
      this.fillIdentiteOptionList();
    })


  }
  displayedEventColumns: string[] = ['jour', 'date', 'inscrit_event', 'participation_event', 'select'];
  displayedInscritColumns: string[] = ['nom', 'prenom', 'inscrit_inscrit', 'participation_inscrit', 'select'];

  async updateDataSources() {
    console.log("updating Data sources");
    this.inscritListOfRows = [];
    this.eventListOfRows = [];
    this.eventList = await this.supabaseService.fetchEventDataByActiviteId(this.activiteData.id);
    this.eventList = [...this.eventList];
    console.log(this.eventList.length);
    for (let i = 0; i < this.eventList.length; i++) {
      let participantList = await this.supabaseService.fetchParticipantDataByEventId(this.eventList[i].id);
      this.inscritList = this.inscritList.concat(participantList);
      console.log("inscritList", this.inscritList);
      let id_event = this.eventList[i].id;
      let date = this.eventList[i].date;
      let jour = this.jourSemaine[new Date(date).getDay()];
      let inscrit_event = participantList.length;
      let participation_event = 0;

      let found = false;
      for (let j = 0; j < inscrit_event; j++) {
        for (let k = 0; k < this.inscritListOfRows.length; k++) {
          if (this.inscritListOfRows[k].id_inscrit == participantList[j].identite_id.id) {
            console.log("found inscrit")
            found = true;
            this.inscritListOfRows[k].inscrit_inscrit = this.inscritListOfRows[k].inscrit_inscrit + 1;
            if (participantList[j].present == true) {

              participation_event = participation_event + 1;
              this.inscritListOfRows[k].participation_inscrit = this.inscritListOfRows[k].participation_inscrit + 1;
            }
          }
        }
        if (found == false) {
          let id_inscrit = participantList[j].identite_id.id;
          let nom = participantList[j].identite_id.nom;
          let prenom = participantList[j].identite_id.prenom;
          let inscrit_inscrit = 1;
          let participation_inscrit = 0;
          if (participantList[j].present == true) {
            participation_event = participation_event + 1;
            participation_inscrit = 1;
          }
          console.log("pushing inscrit");
          this.inscritListOfRows.push({ id_inscrit, nom, prenom, inscrit_inscrit, participation_inscrit });
        }
      }
      console.log("pushing events");
      this.eventListOfRows.push({ id_event, date, jour, inscrit_event, participation_event });
    }
    console.log("inscritListOfRows", this.inscritListOfRows);
    console.log("eventListOfRows", this.eventListOfRows);
    this.eventDataSource = new MatTableDataSource(this.eventListOfRows);
    console.log("eventDataSource", this.eventDataSource.data);
    this.eventSelection = new SelectionModel<eventTableRow>(true);
    this.inscritDataSource = new MatTableDataSource(this.inscritListOfRows);
    console.log("inscritDataSource", this.inscritDataSource.data);
    this.inscritSelection = new SelectionModel<inscritTableRow>(true);
    this.eventDataSource.paginator = this.paginatorEvent;
    this.inscritDataSource.paginator = this.paginatorInscrit;
    this.eventDataSource.sort = this.sortEvent;
    this.inscritDataSource.sort = this.sortInscrit;



    this.inscritDataSource.filter = "";
    this.eventDataSource.filter = "";
    this.eventLoading = false;
  }

  getDisplayColumnName(columnName: string): string {
    const columnMappings: Record<string, string> = {
      'inscrit_event': 'Inscrit',
      'participation_event': 'Participation',
      'inscrit_inscrit': 'Inscrit',
      'participation_inscrit': 'Participation'
    };

    return columnMappings[columnName] || columnName;
  }


  sortEventTable() {
    console.log(this.sortEvent.active);
    this.eventDataSource.sort = this.sortEvent;
  }
  sortInscritTable() {
    this.inscritDataSource.sort = this.sortInscrit;
  }

  //todo
  applyInscritFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.inscritDataSource.filter = filterValue.trim().toLowerCase();

    if (this.inscritDataSource.paginator) {
      this.inscritDataSource.paginator.firstPage();
    }

  }

  filterInscritBySelectedEvents() {
    // Get selected event IDs from the event selection model
    const selectedEventIds = this.eventSelection.selected.map(event => event.id_event);
    console.log("Selected Event IDs:", selectedEventIds);

    if (selectedEventIds.length > 0) {
        console.log("Filtering Inscrits...");

        // Filter inscrits to only include those linked to selected events
        const filteredInscrits = this.inscritListOfRows.filter(inscrit => {
            // Check if the inscrit is linked to any selected event via the participant list
            return this.inscritList.some(participant =>
                participant.identite_id.id === inscrit.id_inscrit && // Match participant ID
                selectedEventIds.includes(participant.event_id.id)    // Match event ID
            );
        });

        console.log("Filtered Inscrits:", filteredInscrits); // Debugging
        this.inscritDataSource.data = filteredInscrits;
    } else {
        console.log("No events selected. Resetting to show all inscrits.");
        // If no event is selected, reset to show all inscrits
        this.inscritDataSource.data = this.inscritListOfRows;
    }

    // Ensure paginator resets to the first page
    if (this.inscritDataSource.paginator) {
        this.inscritDataSource.paginator.firstPage();
    }
}



  applyEventInscritFilter() {
    this.formSelectionDate.patchValue({
      start: this.startDateYear,
      end: this.endDateYear,
      lundi: true,
      mardi: true,
      mercredi: true,
      jeudi: true,
      vendredi: true,
      samedi: true,
      dimanche: true,
    })
    this.applyEventFilter();

  }
  applyDateEventFilter() {
    this.formSelectionDate.patchValue({
      lundi: true,
      mardi: true,
      mercredi: true,
      jeudi: true,
      vendredi: true,
      samedi: true,
      dimanche: true,
    })
    this.applyEventFilter();
  }

  applyEventFilter() {
    console.log("eventfiltering");
    const startDateInput = this.formSelectionDate.controls['start'].value;
    const endDateInput = this.formSelectionDate.controls['end'].value;
    const startDate = new Date(startDateInput);

    let endDate = new Date(endDateInput);
    if (!endDateInput || startDateInput === endDateInput) {
      endDate = new Date(startDateInput);
      endDate.setHours(23, 59, 59, 999); // End of the day

    } else {
      // If the end date is provided, set the end time to the end of the day
      endDate.setHours(23, 59, 59, 999);
    }

    startDate.setHours(0, 0, 0, 0);


    const jours = {
      lundi: this.formSelectionDate.controls['lundi'].value,
      mardi: this.formSelectionDate.controls['mardi'].value,
      mercredi: this.formSelectionDate.controls['mercredi'].value,
      jeudi: this.formSelectionDate.controls['jeudi'].value,
      vendredi: this.formSelectionDate.controls['vendredi'].value,
      samedi: this.formSelectionDate.controls['samedi'].value,
      dimanche: this.formSelectionDate.controls['dimanche'].value
    };
    const selectedInscritIds = this.inscritSelection.selected.map(inscrit => inscrit.id_inscrit);

    const filteredEvents = this.eventListOfRows.filter(event => {
      const eventDate = new Date(event.date);
      const weekday = eventDate.getDay(); // 0 (Sun) - 6 (Sat)

      // Check if event is within the date range and if the corresponding day is selected
      const isInDateRange = (eventDate >= startDate && eventDate <= endDate);
      const isDayIncluded = (
        (weekday === 1 && jours.lundi) ||
        (weekday === 2 && jours.mardi) ||
        (weekday === 3 && jours.mercredi) ||
        (weekday === 4 && jours.jeudi) ||
        (weekday === 5 && jours.vendredi) ||
        (weekday === 6 && jours.samedi) ||
        (weekday === 0 && jours.dimanche)
      );
      const hasSelectedParticipant = selectedInscritIds.length === 0 ||
        this.inscritList
          .filter(participant => participant.event_id.id === event.id_event) // Get participants for the current event
          .some(participant => selectedInscritIds.includes(participant.identite_id.id)); // Check if they are selected

      return isInDateRange && isDayIncluded && hasSelectedParticipant; // Only include events that meet both criteria
    });

    // Update the data source with the filtered data
    this.eventDataSource.data = filteredEvents;

    // Optionally, you can trigger change detection if necessary
    this.eventDataSource._updateChangeSubscription();




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
    console.log(this.activiteData);
    this.formActivite.patchValue({
      nom: this.activiteData.nom,
      secteur: this.activiteData.secteur,
      enfant: this.activiteData.enfant,
      adulte: this.activiteData.adulte
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
    console.log("updating");
    this.activiteData.nom = this.formActivite.controls["nom"].value;
    this.activiteData.secteur = this.formActivite.controls["secteur"].value;
    this.activiteData.adulte = this.formActivite.controls["adulte"].value;
    this.activiteData.enfant = this.formActivite.controls["enfant"].value;
    console.log("updated", this.activiteData);
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

  //to do: prevent duplicates
  //to do: multiple events.
  async ajouterEvent() {
    console.log("adding event");
    this.eventLoading = true;

    // Get the date values from the form
    const startDateInput = this.formSelectionDate.controls['start'].value;
    const endDateInput = this.formSelectionDate.controls['end'].value;

    const startDate = new Date(startDateInput);
    let endDate = new Date(endDateInput);
    if (endDateInput == null) {
      endDate = new Date(startDateInput);
    }

    // Parse dates and ensure they are valid

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid start or end date");
      return; // Exit if the dates are invalid
    }


    console.log("startDate", startDate);
    console.log("endDate", endDate);

    // Get the weekday selections from the form
    const jours = {
      lundi: this.formSelectionDate.controls['lundi'].value,
      mardi: this.formSelectionDate.controls['mardi'].value,
      mercredi: this.formSelectionDate.controls['mercredi'].value,
      jeudi: this.formSelectionDate.controls['jeudi'].value,
      vendredi: this.formSelectionDate.controls['vendredi'].value,
      samedi: this.formSelectionDate.controls['samedi'].value,
      dimanche: this.formSelectionDate.controls['dimanche'].value
    };

    // Normalize the dates to midnight
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Calculate total days between the two dates
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

    // Loop through each day from startDate to endDate
    let date = new Date(startDate);
    for (let i = 0; i <= totalDays; i++) {
      console.log(`day i ${i} date ${date}`);

      let found = false;

      // Check if the event for this date already exists
      for (let j = 0; j < this.eventList.length; j++) {
        const eventDate = new Date(this.eventList[j].date);
        eventDate.setHours(0, 0, 0, 0); // Normalize for comparison

        if (date.getTime() === eventDate.getTime()) {
          found = true;
          console.log(`Event already exists for ${date}`);
          break; // Stop checking if a match is found
        }
      }

      // Check if the current date is a day we want to insert and not found already
      const weekday = date.getDay();
      const shouldInsert = (jours.lundi && weekday === 1) ||
        (jours.mardi && weekday === 2) ||
        (jours.mercredi && weekday === 3) ||
        (jours.jeudi && weekday === 4) ||
        (jours.vendredi && weekday === 5) ||
        (jours.samedi && weekday === 6) ||
        (jours.dimanche && weekday === 0);

      // Insert event if conditions are met and event not found
      if (shouldInsert && !found) {
        const event: EventActivite = {
          id: null,
          activite_id: this.activiteData.id,
          date: new Date(date) // Clone the date for the new event
        };
        event.date.setDate(date.getDate() + 1);
        console.log(`inserting event: ${JSON.stringify(event)}`);
        await this.supabaseService.insertEventData(event);
      } else if (found) {
        console.log(`skipped ${date}`);
      }

      // Increment the date by one day
      date.setDate(date.getDate() + 1);
    }

    this.updateDataSources();
  }



  async supprimerEvent() {
    this.eventLoading = true;
    for (let i = 0; i < this.eventSelection.selected.length; i++) {
      for (let j = 0; j < this.inscritList.length; j++) {
        console.log("j", j)
        if (this.eventSelection.selected[i].id_event == this.inscritList[j].event_id.id) {
          console.log("selected", this.eventSelection.selected[i].id_event, "inscrit", this.inscritList[j].event_id.id)
          await this.supabaseService.supprimerParticipantData(this.inscritList[j].id);
        }
      }
      await this.supabaseService.supprimerEventData(this.eventSelection.selected[i].id_event);
    }
    this.updateDataSources();
  }



  async inscrireJeune() {

    console.log("nomPrenomForm", this.nomPrenomControl.value);
    this.eventLoading = true;
    if (this.nomPrenomControl.value != "" && this.nomPrenomControl.value != null) {
      let nomPrenomArray = this.nomPrenomControl.value.split(" ")
      console.log("nomPrenomArray", nomPrenomArray);
      for (let i = 0; i < this.identiteList.length; i++) {

        if (nomPrenomArray[0] == this.identiteList[i].nom && nomPrenomArray[1] == this.identiteList[i].prenom) {
          for (let j = 0; j < this.eventSelection.selected.length; j++) {
            //let currentDate = new Date();
            let found = false;
            for (let k = 0; k < this.inscritList.length; k++) {
              if (this.inscritList[k].identite_id.id == this.identiteList[i].id && this.inscritList[k].event_id.id == this.eventSelection.selected[j].id_event) {
                found = true;
              }
            }
            //new Date(this.eventSelection.selected[j].date) > currentDate &&
            if (found == false) {

              let event: EventActivite = {
                id: this.eventSelection.selected[j].id_event,
                activite_id: this.activiteData.id,
                date: this.eventSelection.selected[j].date
              };
              let participant: Participant = {
                id: null,
                identite_id: this.identiteList[i],
                event_id: event,
                present: false
              }
              this.supabaseService.insertParticipantData(participant);
            }
          }
        }
      }
    }
    this.updateDataSources();
  }

  async desincrireJeune() {
    this.eventLoading = true;
    for (let i = 0; i < this.inscritSelection.selected.length; i++) {
      console.log("inscrit", this.inscritSelection.selected[i].nom)
      for (let j = 0; j < this.eventSelection.selected.length; j++) {
        console.log("event", this.eventSelection.selected[i].date)
        for (let k = 0; k < this.inscritList.length; k++) {
          //console.log("i:",i,"inscrit_id", this.inscritSelection.selected[i].id_inscrit,"j:",j,"event_id",this.)
          if (this.inscritList[k].identite_id.id == this.inscritSelection.selected[i].id_inscrit && this.inscritList[k].event_id.id == this.eventSelection.selected[j].id_event) {
            await this.supabaseService.supprimerParticipantData(this.inscritList[k].id);
          }
        }
      }
    }
    this.updateDataSources();
  }


  goToInscritPage(id: string) {
    console.log(id);
    for (let i = 0; i < this.jeuneList.length; i++) {
      if (id == this.jeuneList[i].identite_id.id) {
        this.router.navigate([`/jeunesse/${this.jeuneList[i].id}`]);
      }
    }
  }
  goToEventPage(id: string) {
    console.log("goToEventPage", id)
    this.router.navigate([`/event/${id}`]);
  }

  goBack() {
    this.router.navigate(['activités']);
  }

}
