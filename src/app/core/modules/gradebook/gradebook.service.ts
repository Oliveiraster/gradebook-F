import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade } from './grade.model';
import { StudentGradeReport } from './student-grade-report.model';
import { HttpErrorUtil } from '../../shared/utils/http-error.util';

@Injectable({ providedIn: 'root' })
export class GradebookService {
  private readonly api = 'http://localhost:8080';
  private readonly http = inject(HttpClient);
  private readonly errorUtil = inject(HttpErrorUtil);

  getGradebook(classId: number, subjectId: number): Observable<StudentGradeReport[]> {
    return this.http
      .get<StudentGradeReport[]>(`${this.api}/grades/turma/${classId}/disciplina/${subjectId}`)
      .pipe(this.errorUtil.handleError('buscar boletim de notas'));
  }

  saveGrades(grades: Grade[]): Observable<void> {
    return this.http.post<void>(`${this.api}/grades`, grades).pipe(this.errorUtil.handleError('salvar notas'));
  }
}
