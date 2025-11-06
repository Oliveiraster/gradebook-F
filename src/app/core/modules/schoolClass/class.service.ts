import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchoolClass } from './school-class.model';
import { HttpErrorUtil } from '../../shared/utils/http-error.util';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private readonly api = 'http://localhost:8080';
  private readonly http = inject(HttpClient);
  private readonly errorUtil = inject(HttpErrorUtil);

  getClasses(): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(`${this.api}/turmas`).pipe(this.errorUtil.handleError('buscar turmas'));
  }
}
