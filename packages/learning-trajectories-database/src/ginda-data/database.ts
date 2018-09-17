import { Map } from 'immutable';

import { LinearNetwork } from './linear-network';

import * as rawDatabase from '../../../../raw-data/database.json';

// TODO: Add more complete documentation/typings
export interface LTDatabase {
  courseMetaData: {
    id: string,
    title: string
  }[];

  personCourseActivities: {
    name: string[]; // element 0 is user_id
    directed: string[];
    vertices: any[]; // See linear-network.ts::getNode
    edges: any[] // See linear-network.ts::getEdge
  }[];
  
  personMetadata: {
    user_id: string;
    grade: number; // 0.0 to 1.0
    gender: string; // m, f, other; see person-metadata.ts
    loe: string; // => becomes levelOfEducation: string; See person-metadata.ts
    yob: string; // => becomes born: number; See person-metadata.ts
  }[];
}

export class LearnerTrajectoriesDatabase {
  readonly courseMetaData: Map<string, {id: string, title: string}>;
  readonly linearNetworks: Map<string, Map<string, LinearNetwork>>;

  constructor(private rawDatabase: LTDatabase) {
    this.linearNetworks = Map(this.makeLinearNetworks());
    this.courseMetaData = Map(this.makeCourseMetaData());
  }

  makeCourseMetaData() {
    const metadata = {};
    for (const meta of this.rawDatabase.courseMetaData) {
      metadata[meta.id] = meta;
    }
    return metadata;
  }

  makeLinearNetworks() {
    let rawNetworks = {};
    const rawPersons = this.rawDatabase.personCourseActivities;
    const personsMetaData = this.rawDatabase.personMetadata;

    for(let i = 1; i <= rawPersons.length; i++) {
      const personName = 'person' + i;
      const rawPerson = rawPersons[i-1];
      if (!(personName in rawNetworks)) {
        const rawMetaData = personsMetaData.filter(m => m.user_id === rawPerson.name[0])[0];
        //TODO get Course ID in a better way
        rawNetworks[personName] = Map().set(
          rawPerson.vertices[0].courseID, 
          new LinearNetwork(rawPerson, rawMetaData || {})
        );
      } else {
        const rawMetaData = personsMetaData.filter(m => m.user_id = rawPerson.name[0])[0];
        rawNetworks[personName] = rawNetworks[personName].set(
          rawPerson.vertices[0].courseID, 
          new LinearNetwork(rawPerson, rawMetaData || {})
        );
      }
    }
    return rawNetworks;
  }
}

export const database = new LearnerTrajectoriesDatabase(<LTDatabase>rawDatabase);
