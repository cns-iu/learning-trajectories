import { Map } from 'immutable';

import { LinearNetwork } from './linear-network';

import * as rawDatabase from '../../../../raw-data/database.json';

export class LearnerTrajectoriesDatabase {
  readonly courseMetaData: Map<string, {id: string, title: string}>;
  readonly linearNetworks: Map<string, Map<string, LinearNetwork>>;

  constructor() {
    this.linearNetworks = Map(this.makeLinearNetworks());
    this.courseMetaData = Map(this.makeCourseMetaData());
  }

  makeCourseMetaData() {
    const metadata = {};
    for (const meta of rawDatabase.courseMetaData) {
      metadata[meta.id] = meta;
    }
    return metadata;
  }

  makeLinearNetworks() {
    let rawNetworks = {};
    const rawPersons: any[] = rawDatabase.personCourseActivities;
    const personsMetaData: any[] = rawDatabase.personMetadata;

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

export const database = new LearnerTrajectoriesDatabase();
