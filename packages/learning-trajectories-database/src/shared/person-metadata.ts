import { Map } from 'immutable';

export interface PersonMetaData {
  grade: string;
  gender: string;
  levelOfEducation: string;
  born: number;
}

export const genderMapping = Map({
  'm': 'Male',
  'f': 'Female',
  'other': 'Other'
});

export const levelOfEducationMapping = Map({
  'hs': 'High School',
  'b': 'Bachelors',
  'm': 'Masters',
  'p': 'PhD',
  'a': 'Associates',
  'other': 'Other',
  'none': 'None',
});
