import { Map } from 'immutable';

import { LinearNetwork } from './linear-network';

//raw-data file imports
import * as person1 from '../../../../raw-data/person1.json';
import * as person2 from '../../../../raw-data/person2.json';
import * as person3 from '../../../../raw-data/person3.json';
import * as person4 from '../../../../raw-data/person4.json';
import * as person5 from '../../../../raw-data/person5.json';
import * as personsMetaData from '../../../../raw-data/person-metadata.json';

const rawPersons = [
  person1,
  person2,
  person3,
  person4,
  person5
];
export class LearnerTrajectoriesDatabase {
  readonly linearNetworks: Map<string, Map<string, LinearNetwork>>;

  constructor() {
    this.linearNetworks = Map(this.makeLinearNetworks());
  }

  makeLinearNetworks() {
    let rawNetworks = {};

    for(let i = 1; i <= rawPersons.length; i++) {
      const personName = 'person' + i;
      const rawPerson = rawPersons[i-1];
      if (!(personName in rawNetworks)) {
        const rawMetaData = personsMetaData.filter(m => m.user_id === rawPerson.name[0])[0];
        //TODO get Course ID in a better way
        rawNetworks[personName] = Map().set(
          rawPerson.vertices[0].courseID, 
          new LinearNetwork(rawPerson, rawMetaData)
        );
      } else {
        const rawMetaData = personsMetaData.filter(m => m.user_id = rawPerson.name[0])[0];
        rawNetworks[personName] = rawNetworks[personName].set(
          rawPerson.vertices[0].courseID, 
          new LinearNetwork(rawPerson, rawMetaData)
        );
      }
    }
    return rawNetworks;
  }
}

export const database = new LearnerTrajectoriesDatabase();
