const supabase = createClient('http://127.0.0.1:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');
  async function f1(supabase:any) {
    const data = await supabase 
    .from('test')
    .select()
    return(data);   
  }

  data = f1(supabase)
  saveData = []

  checkNull(data:any){  
    if (data != null){
      return data

    }else{
      console.log("data base = null")
    }

  }
  safeData = this.checkNull(this.data)










   <div class="profile-header">
        <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
        </button>
        <h3>
            <!-- Profile de {{jeuneData.firstName }} {{jeuneData.lastName}} -->
        </h3>
        <span class="spacer"></span>
        <button mat-button (click)="toggleEditMode()">
            <mat-icon>edit</mat-icon>
            <span *ngIf="!editMode">Editer</span>
            <span *ngIf="editMode">Annuler</span>
        </button>
        <button mat-button (click)="saveData()" >
            <span *ngIf="editMode">Sauvegarder</span>
        </button>
    </div>
    <div class="profile-content">

        <div [formGroup]="form" >
            <mat-form-field appearance="outline">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="firstName" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="lastName" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Mobile</mat-label>
                <input matInput formControlName="mobile" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Fixe</mat-label>
                <input matInput formControlName="fixe" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Mail</mat-label>
                <input matInput formControlName="mail" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
                <mat-label>Adresse</mat-label>
                <input matInput formControlName="adresse" required>
            </mat-form-field>
            <p>Entered value: {{form.valueChanges | async | json}}</p>
        </div>

    </div>




