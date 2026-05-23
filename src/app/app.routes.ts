import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { ProjectDetailPageComponent } from './pages/project-detail/project-detail-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'projects/:slug', component: ProjectDetailPageComponent },
  { path: '**', redirectTo: '' },
];
