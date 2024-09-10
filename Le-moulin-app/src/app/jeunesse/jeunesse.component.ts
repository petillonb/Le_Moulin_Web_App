import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Jeune } from '../entities/jeune.entite';
import {MatSort, MatSortModule} from '@angular/material/sort' ;
import {AfterViewInit , ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-jeunesse',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatCheckboxModule,MatSortModule, MatPaginatorModule, FormsModule, MatSidenavModule,MatFormFieldModule, MatInputModule],
  providers: [SupabaseService],
  templateUrl: './jeunesse.component.html',
  styleUrl: './jeunesse.component.scss',
})
export class JeunesseComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  listOfJeunes: Jeune[] = []

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    this.listOfJeunes = await this.supabaseService.fetchJeunesseData()
  } 

  displayedColumns: string[] = ['firstName', 'lastName', 'mobile', 'fixe', 'mail', 'adresse'];
  dataSource = new MatTableDataSource(this.listOfJeunes);


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  goToJeunePage(idJeune: string){
    console.log("goToJeunePage", idJeune)
    this.router.navigate([`/jeunesse/${idJeune}`]);
  }
  goToNouveauJeunePage(){
    console.log("goToJeunePage")
    this.router.navigate([`/jeunesse/nouveau`]);
  }

}

