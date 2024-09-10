import { Routes } from '@angular/router';
import { ActiviteComponent } from './activite/activite.component';
import { HomepageComponent } from './homepage/homepage.component';
import { JeunesseComponent } from './jeunesse/jeunesse.component';
import { NouveauProfileJeuneComponent } from './nouveau-profile-jeune/nouveau-profile-jeune.component';
import { ProfileJeuneComponent } from './profile-jeune/profile-jeune.component';

export const routes: Routes = [

    { path: '', redirectTo: "/homepage", pathMatch: 'full' },
    { path: 'homepage', component: HomepageComponent },
    {   
        path: 'jeunesse', children: [
            { path: 'list', component: JeunesseComponent },
            { path: 'nouveau', component: NouveauProfileJeuneComponent },
            { path: ':id', component: ProfileJeuneComponent },
            { path: '', redirectTo: 'list', pathMatch: 'full' },
        ]
    },
    { path: 'activités', component: ActiviteComponent },
    
];
