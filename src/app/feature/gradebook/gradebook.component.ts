import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { Student } from '../../core/modules/student/student.model';
import { Assessment } from '../../core/modules/subject/assessment.model';
import { Grade } from '../../core/modules/gradebook/grade.model';
import { SchoolClass } from '../../core/modules/schoolClass/school-class.model';
import { Subject } from '../../core/modules/subject/subject.model';
import { ClassService } from '../../core/modules/schoolClass/class.service';
import { SubjectService } from '../../core/modules/subject/subject.service';
import { StudentService } from '../../core/modules/student/students.service';
import { GradebookService } from '../../core/modules/gradebook/gradebook.service';

@Component({
  selector: 'app-gradebook',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './gradebook.component.html',
  styleUrl: './gradebook.component.scss',
})
export class GradebookComponent {
  private classService = inject(ClassService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);
  private gradebookService = inject(GradebookService);

  filterForm = new FormGroup({
    classId: new FormControl<number | null>(null),
    subjectId: new FormControl<number | null>(null),
  });

  classes: SchoolClass[] = [];
  subjects: Subject[] = [];
  students: Student[] = [];
  assessments: Assessment[] = [];

  form: FormGroup = new FormGroup({});
  midMap: Record<number, number | '-'> = {};

  constructor() {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.classService.getClasses().subscribe(classes => (this.classes = classes));
    this.subjectService.getSubjects().subscribe(subjects => (this.subjects = subjects));
  }

  loadStudentsAndGrades(): void {
    const selectedClassId = this.filterForm.get('classId')?.value;
    const selectedSubjectId = this.filterForm.get('subjectId')?.value;

    if (!selectedClassId || !selectedSubjectId) return;

    this.gradebookService.getGradebook(selectedClassId, selectedSubjectId).subscribe(gradebook => {
      console.log('Dados recebidos do backend:', gradebook);

      this.students = gradebook.map(g => ({
        id: g.studentId,
        name: g.studentName,
      }));

      this.subjectService.getAssessments(selectedSubjectId).subscribe(assessments => {
        console.log(assessments);
        this.assessments = assessments.map(a => ({
          id: a.id,
          title: a.title,
          weight: a.weight,
        }));

        if (!this.assessments.length) {
          this.assessments = [{ id: 1, title: 'Avaliação 1', weight: 1 }];
        }
        this.initForm();

        gradebook.forEach(g => {
          Object.entries(g.grades || {}).forEach(([assessmentId, score]) => {
            const controlName = this.getControlName(g.studentId, Number(assessmentId));
            this.form.get(controlName)?.setValue(score);
          });
        });

        this.form.valueChanges.subscribe(() => this.calculateAverage());
        this.calculateAverage();
      });
    });
  }

  onSearch(): void {
    this.loadStudentsAndGrades();
  }

  initForm(): void {
    this.form = new FormGroup({});
    if (!this.students.length || !this.assessments.length) return;

    this.students.forEach(student => {
      this.assessments.forEach(assessment => {
        const controlName = this.getControlName(student.id, assessment.id);
        const control = new FormControl(null, this.maxScoreValidator(10));
        this.form.addControl(controlName, control);
      });
    });
  }

  getControlName(studentId: number, assessmentId: number): string {
    return `s${studentId}_${assessmentId}`;
  }

  calculateAverage(): void {
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

  save(): void {
    const invalid = Object.values(this.form.controls).some(ctrl => ctrl.value > 10);
    if (invalid) {
      alert('Existem notas acima do valor máximo (10). Corrija antes de salvar.');
      return;
    }

    const grades: Grade[] = [];
    this.students.forEach(student => {
      this.assessments.forEach(assessment => {
        const val = this.form.get(this.getControlName(student.id, assessment.id))?.value;
        if (val != null && val !== '') {
          grades.push({
            studentId: student.id,
            assessmentId: assessment.id,
            score: val,
          });
        }
      });
    });

    this.gradebookService.saveGrades(grades).subscribe({
      next: () => {
        console.log('Grades successfully saved!');
        this.onSearch();
      },
      error: err => console.error('Error saving grades:', err),
    });
  }

  openAddStudentDialog(): void {
    const selectedClassId = this.filterForm.get('classId')?.value;
    if (!selectedClassId) {
      alert('Selecione uma turma antes de adicionar um aluno.');
      return;
    }

    const name = prompt('Digite o nome do novo aluno:');
    if (!name || name.trim() === '') return;

    this.studentService.createStudent({ name: name.trim(), classId: selectedClassId }).subscribe({
      next: () => {
        console.log('Aluno adicionado com sucesso');
        this.loadStudentsAndGrades();
      },
      error: err => console.error('Erro ao adicionar aluno:', err),
    });
  }

  editStudent(student: Student): void {
    const newName = prompt('Digite o novo nome do aluno:', student.name);
    if (!newName || newName.trim() === '') return;

    this.studentService.updateStudent(student.id, newName.trim()).subscribe({
      next: () => {
        console.log('Aluno atualizado com sucesso');
        this.loadStudentsAndGrades();
      },
      error: err => console.error(' Erro ao atualizar aluno:', err),
    });
  }

  deleteStudent(studentId: number): void {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;

    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        console.log('Aluno deletado com sucesso');
        this.loadStudentsAndGrades();
      },
      error: err => console.error('Erro ao deletar aluno:', err),
    });
  }

  limitScore(event: Event, studentId: number, assessmentId: number): void {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (isNaN(value)) return;

    const controlName = this.getControlName(studentId, assessmentId);
    const control = this.form.get(controlName);

    if (value > 10) {
      value = 10;
    } else {
      control?.setErrors(null);
    }
    if (value < 0) {
      value = 0;
    }

    input.value = value.toString();
    control?.setValue(value, { emitEvent: false });

    this.calculateAverage();
  }

  maxScoreValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value != null && control.value > max) {
        return { maxScore: { max, actual: control.value } };
      }
      return null;
    };
  }
}
