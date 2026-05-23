import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { ProjectDetailPageComponent } from './pages/project-detail/project-detail-page.component';
import { GamesPageComponent } from './pages/games/games-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'projects/:slug', component: ProjectDetailPageComponent },
  { path: 'games', component: GamesPageComponent },
  { path: '**', redirectTo: '' },
];
