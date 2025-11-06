import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './student.model';
import { CreateStudentDTO } from './create-student.model';
import { HttpErrorUtil } from '../../shared/utils/http-error.util';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly api = 'http://localhost:8080';
  private readonly http = inject(HttpClient);
  private readonly errorUtil = inject(HttpErrorUtil);

  createStudent(student: CreateStudentDTO): Observable<Student> {
    return this.http
      .post<Student>(`${this.api}/alunos/turma/${student.classId}`, { name: student.name })
      .pipe(this.errorUtil.handleError('criar aluno'));
  }

  deleteStudent(studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/alunos/${studentId}`).pipe(this.errorUtil.handleError('deletar aluno'));
  }

  updateStudent(studentId: number, name: string): Observable<void> {
    return this.http
      .put<void>(`${this.api}/alunos/${studentId}`, { name })
      .pipe(this.errorUtil.handleError('atualizar aluno'));
  }
}
