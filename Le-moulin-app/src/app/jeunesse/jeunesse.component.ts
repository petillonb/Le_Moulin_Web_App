import { ChangeDetectionStrategy, Component, computed, OnInit, signal,AfterViewInit,ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Jeune } from '../entities/jeune.entite';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';



export interface tableRow {
  id: number;
  prenom: string;
  nom: string;
}



@Component({
  selector: 'app-jeunesse',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatCheckboxModule, MatSortModule, MatPaginatorModule, FormsModule, MatSidenavModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  providers: [SupabaseService],
  templateUrl: './jeunesse.component.html',
  styleUrl: './jeunesse.component.scss',
})
export class JeunesseComponent implements OnInit {
  dataSource: MatTableDataSource<tableRow>;
  selection : SelectionModel<tableRow>;

  @ViewChild(MatTable) table: MatTable<tableRow>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  nomPrenom = new FormControl('');
  listOfJeunes: Jeune[] = []
  listOfRows: tableRow[] = []

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  

  async ngOnInit() {
    this.listOfJeunes = await this.supabaseService.fetchJeunesseData()
    console.log(this.listOfJeunes)
    for (let i = 0; i < this.listOfJeunes.length; i++) {
      let id = this.listOfJeunes[i].id;
      console.log(id)
      let prenom = this.listOfJeunes[i].identite_id.prenom;
      console.log(prenom)
      let nom = this.listOfJeunes[i].identite_id.nom;
      console.log(nom)
      this.listOfRows.push({ id, nom, prenom })
      console.log(this.listOfRows[i]);
    }
    this.dataSource = new MatTableDataSource(this.listOfRows);
    this.selection = new SelectionModel<tableRow>(true); 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    

  }

  displayedColumns: string[] = [ 'nom', 'prenom','select'];


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: tableRow): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  supprimeJeune() {
    console.log(this.selection.selected); // Access the array of selected rows
    for(let i = 0; i < this.selection.selected.length;i++){
      this.supabaseService.supprimerJeuneData(this.selection.selected[i].id);
      for(let j = 0; j< this.dataSource.data.length; j++){
        if(this.dataSource.data[j].id == this.selection.selected[i].id){
          this.dataSource.data.splice(j,1);
          this.dataSource.filter = "";
          console.log(this.dataSource.data);
        }
      }
    }
    this.table.renderRows();

  }

  
  async createJeune() {
    console.log("create jeune")
    if (this.nomPrenom.value != null) {
      console.log(this.nomPrenom.value);
      let nomPrenomArray = this.nomPrenom.value.split(" ")
      console.log(nomPrenomArray);
      let nouveauJeune = {
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
          nom: nomPrenomArray[0],
          prenom: nomPrenomArray[1],
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
      console.log(nouveauJeune);
      nouveauJeune.identite_id.contact_id.id = (await this.supabaseService.insertContactData(nouveauJeune.identite_id.contact_id)).id;
      nouveauJeune.identite_id.id = (await this.supabaseService.insertIdentiteData(nouveauJeune.identite_id)).id;
      nouveauJeune.id = (await this.supabaseService.insertJeunesseData(nouveauJeune)).id;
      this.router.navigate([`/jeunesse/${nouveauJeune.id}`]);
    }

  }



  goToJeunePage(idJeune: string) {
    console.log("goToJeunePage", idJeune)
    this.router.navigate([`/jeunesse/${idJeune}`]);
  }

  goToNouveauJeunePage() {
    console.log("goToJeunePage")
    this.router.navigate([`/jeunesse/nouveau`]);
  }



}

