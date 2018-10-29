import { gql } from 'apollo-server';

export const query_schema = gql`
    type CourseModule {
        module_id: String
        course_id: String
        category: String
        name: String
        chapter_id: String
        sequential_id: String
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
        module_id: String
        next_module_id: String
        next_index: Int
        direction: String
        distance: Int
        event_type: String
        duration: Float
        time: String
    }

    type Query {
        courseModules: [CourseModule]
        transitions: [Transition]
        courses: [Course]
        students: [Student]
    }
`;
