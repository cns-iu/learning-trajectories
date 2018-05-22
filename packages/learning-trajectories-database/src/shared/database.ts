import { Map } from 'immutable';

import { LinearNetwork } from './linear-network';

const numRawPersons = 3;

export class LearnerTrajectoriesDatabase {
  readonly linearNetworks: Map<string, Map<string, LinearNetwork>>;

  constructor() {
    this.linearNetworks = Map(this.makeLinearNetworks());    
  }

  makeLinearNetworks() {
    let rawNetworks = {};

    for(let i = 1; i<= numRawPersons; i++) {
      const personName = 'person' + i;
      const rawPerson = require('../../../../raw-data/'+personName+'.json');
      console.log(typeof rawPerson.vertices[0].courseID)
      if (!(personName in rawNetworks)) {
        //TODO get Course ID in a better way
        rawNetworks[personName] = Map().set(rawPerson.vertices[0].courseID, new LinearNetwork(rawPerson));
      } else {
        rawNetworks[personName] = rawNetworks[personName].set(rawPerson.vertices[0].courseID, new LinearNetwork(rawPerson));
      }
    }

    return rawNetworks;
  }
}

export const database = new LearnerTrajectoriesDatabase();