import { Injectable } from '@angular/core';
import { Project, Person } from './model';
import { PROJECTS } from '../fake-data/fakedata';
@Injectable()
export class ProjectService {
    getProjects(): Project[] {
        // actual implementation would use async method
        return PROJECTS;
    }
}