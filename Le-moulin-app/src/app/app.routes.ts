import { Routes } from '@angular/router';
import { ActiviteComponent } from './activite/activite.component';
import { HomepageComponent } from './homepage/homepage.component';
import { JeunesseComponent } from './jeunesse/jeunesse.component';
import { NouveauProfileJeuneComponent } from './nouveau-profile-jeune/nouveau-profile-jeune.component';
import { ProfileJeuneComponent } from './profile-jeune/profile-jeune.component';
import { ActivitePageComponent } from './activite-page/activite-page.component';
import {EventComponent} from './event/event.component';

export const routes: Routes = [

    { path: '', redirectTo: "/homepage", pathMatch: 'full' },
    { path: 'homepage', component: HomepageComponent },
    {   
        path: 'jeunesse', children: [
            { path: 'list', component: JeunesseComponent },
            { path: ':id', component: ProfileJeuneComponent },
            { path: '', redirectTo: 'list', pathMatch: 'full' },
        ]
    },
    { 
        path: 'activités', children:[
            { path: 'list', component: ActiviteComponent },
            { path: ':id', component: ActivitePageComponent },
            //{ path: 'event:id', component: EventComponent},
            { path: '', redirectTo: 'list', pathMatch: 'full' },
        ] 
    },
    {   
        path: 'event', children: [
            { path: ':id', component: EventComponent },
            { path: '', redirectTo: '/activités', pathMatch: 'full' },
        ]
    },
    
];
