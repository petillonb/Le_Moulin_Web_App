import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Jeune } from '../entities/jeune.entite';




const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');



@Component({
  selector: 'app-jeunesse',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatCheckboxModule, FormsModule, MatSidenavModule],
  providers: [SupabaseService],
  templateUrl: './jeunesse.component.html',
  styleUrl: './jeunesse.component.scss',
})
export class JeunesseComponent implements OnInit {

  listOfJeunes: Jeune[] = []

  constructor(
    private supabaseService: SupabaseService
  ) { }

  async ngOnInit() {
    this.listOfJeunes = await this.supabaseService.fetchJeunesseData()
  }


  displayedColumns: string[] = ['lastName', 'firstName', 'mobile', 'fixe', 'mail', 'adresse'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
}
