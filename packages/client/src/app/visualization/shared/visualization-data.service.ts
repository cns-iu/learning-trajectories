import { Injectable } from '@angular/core';

import { DatabaseService } from 'learning-trajectories-database';

@Injectable()
export class VisualizationDataService {

  constructor(private databaseService: DatabaseService) { }

}
