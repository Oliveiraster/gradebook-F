import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { Student } from '../../core/models/student.model';
import { Assessment } from '../../core/models/assessment.model';
import { Grade } from '../../core/models/grade.model';

@Component({
  selector: 'app-gradebook',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './gradebook.component.html',
  styleUrl: './gradebook.component.scss',
})
export class GradebookComponent {
  filterForm = new FormGroup({
    classId: new FormControl<number | null>(null),
    subjectId: new FormControl<number | null>(null),
  });

  classes = [
    { id: 1, name: '1º Ano A' },
    { id: 2, name: '1º Ano B' },
  ];

  subjects = [
    { id: 1, name: 'Matemática' },
    { id: 2, name: 'História' },
  ];

  studentsByClass: Record<number, Student[]> = {
    1: [
      { id: 1, name: 'José' },
      { id: 2, name: 'Marcos' },
      { id: 3, name: 'Aurélio' },
    ],
    2: [
      { id: 4, name: 'Ana' },
      { id: 5, name: 'Carlos' },
    ],
  };

  assessmentsBySubject: Record<number, Assessment[]> = {
    1: [
      { id: 1, name: 'Prova', weight: 5 },
      { id: 2, name: 'Trabalho', weight: 3 },
      { id: 3, name: 'Atividade', weight: 2 },
    ],
    2: [
      { id: 4, name: 'Prova', weight: 4 },
      { id: 5, name: 'Seminário', weight: 1 },
    ],
  };

  students: Student[] = [];
  assessments: Assessment[] = [];
  form: FormGroup = new FormGroup({});
  midMap: Record<number, number | '-'> = {};

  onSearch(): void {
    const selectedClassId = this.filterForm.get('classId')?.value;
    const selectedSubjectId = this.filterForm.get('subjectId')?.value;

    if (selectedClassId && selectedSubjectId) {
      this.students = this.studentsByClass[selectedClassId] || [];
      this.assessments = this.assessmentsBySubject[selectedSubjectId] || [];
      this.initForm();
      this.form.valueChanges.subscribe(() => this.calculateAverage());
    }
  }

  initForm() {
    this.form = new FormGroup({});
    if (!this.students.length || !this.assessments.length) return;

    this.students.forEach(student => {
      this.assessments.forEach(assessment => {
        const controlName = this.getControlName(student.id, assessment.id);
        this.form.addControl(controlName, new FormControl(null));
      });
    });
  }

  getControlName(studentId: number, assessmentId: number) {
    return `s${studentId}_${assessmentId}`;
  }

  calculateAverage() {
    this.midMap = {};
    this.students.forEach(student => {
      let total = 0;
      let weightTotal = 0;
      this.assessments.forEach(assessment => {
        const val = this.form.get(this.getControlName(student.id, assessment.id))?.value;
        if (val != null && val !== '') {
          total += val * assessment.weight;
          weightTotal += assessment.weight;
        }
      });
      this.midMap[student.id] = weightTotal ? +(total / weightTotal).toFixed(1) : '-';
    });
  }

  save() {
    const grade: Grade[] = [];
    this.students.forEach(student => {
      this.assessments.forEach(av => {
        const val = this.form.get(this.getControlName(student.id, av.id))?.value;
        if (val != null && val !== '') {
          grade.push({
            studentId: student.id,
            AssessmentId: av.id,
            score: val,
          });
        }
      });
    });
    console.log('Salvo:', grade);
  }
}
