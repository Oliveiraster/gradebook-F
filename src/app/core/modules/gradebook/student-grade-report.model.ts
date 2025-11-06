export interface StudentGradeReport {
  studentId: number;
  studentName: string;
  grades: Record<number, number>;
  weightedAverage: number;
}
