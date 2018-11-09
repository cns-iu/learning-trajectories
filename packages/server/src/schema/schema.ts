import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Date

  type CourseModule {
    module_id: String
    course_id: String
    category: String
    name: String
    chapter_id: String
    chapter_name: String
    sequential_id: String
    sequential_name: String
    vertical_id: String
    level: Int
    index: Int
    first_leaf_index: Int
  }

  type Course {
    course_id: String
    course_title: String
  }

  type Student {
    user_id: String
    course_id: String
    grade: String
    gender: String
    LoE: String
    YoB: Int
    cert_created_date: String
    cert_modified_date: String
    cert_status: String
  }

  type Transition {
    user_id: String
    course_id: String
    index: Int
    first_leaf_index: Int
    module_id: String
    module_label: String
    next_module_id: String
    next_module_label: String
    next_index: Int
    next_first_leaf_index: Int
    direction: String
    distance: Int
    event_type: String
    duration: Float
    time: String
  }

  input NumericBounds {
    min: Int!
    max: Int!
  }

  input StudentFilter {
    user_id: String
    born: NumericBounds
    grade: NumericBounds
    education: String
    course: String
  }

  input Filter {
    user_id: String
    includeUnused: Boolean
  }

  type Query {
    courseModules(filter: Filter): [CourseModule!]!
    transitions(filter: Filter): [Transition!]!
    courses(filter: Filter): [Course!]!
    students(filter: StudentFilter): [Student!]!
  }
`;
