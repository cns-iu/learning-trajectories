export interface Filter {
  personName: string;
  includeUnused: boolean;
}

export interface MetaFilter {
  age: [number, number];
  grade: [number, number];
  education: string;
  course: string;
}
