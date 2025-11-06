import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from './subject.model';
import { Assessment } from './assessment.model';
import { HttpErrorUtil } from '../../shared/utils/http-error.util';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly api = 'http://localhost:8080';
  private readonly http = inject(HttpClient);
  private readonly errorUtil = inject(HttpErrorUtil);

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.api}/disciplinas`).pipe(this.errorUtil.handleError('buscar disciplinas'));
  }

  getAssessments(subjectId: number): Observable<Assessment[]> {
    return this.http
      .get<Assessment[]>(`${this.api}/avaliacoes/disciplina/${subjectId}`)
      .pipe(this.errorUtil.handleError('buscar avaliações'));
  }
}
