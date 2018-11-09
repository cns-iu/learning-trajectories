import { CourseModuleResolver } from './course-module.resolver';
import { CourseResolver } from './course.resolver';
import { StudentResolver } from './student.resolver';
import { TransitionResolver } from './transition.resolver';

export const resolvers = [
  new CourseModuleResolver(),
  new CourseResolver(),
  new StudentResolver(),
  new TransitionResolver(),
].map(t => t.resolvers);
