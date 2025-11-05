import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { GradebookComponent } from './feature/gradebook/gradebook.component';

export const routes: Routes = [
  { path: '', redirectTo: 'gradebook', pathMatch: 'full' },
  { path: 'gradebook', component: GradebookComponent },
  { path: '**', component: NotFoundComponent },
];
