import { Map } from 'immutable';

import { LinearNetwork } from './linear-network';

const numRawPersons = 3;

export class LearnerTrajectoriesDatabase {
  readonly linearNetworks: Map<string, LinearNetwork>;

  constructor() {
    this.linearNetworks = Map(this.makeLinearNetworks());    
  }

  makeLinearNetworks() {
    let rawNetworks = {};

    for(let i = 1; i<= numRawPersons; i++) {
      const rawPerson = require('../../../../raw-data/person'+i+'.json');
      rawNetworks['person'+i] = new LinearNetwork(rawPerson);
    }

    return rawNetworks;
  }
}

export const database = new LearnerTrajectoriesDatabase();