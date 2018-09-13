var fs = require('fs');
var path = require('path');
var datalib = require('datalib');
var args = process.argv.slice(2);

var BASE_DIR = '../../raw-data/data';
var output = '../../raw-data/database.json';

function readFile(inputFile) {
  return fs.readFileSync(inputFile, 'utf8');
}
function readJSON(inputFile) {
  return JSON.parse(readFile(inputFile));
}
function readCSV(inputFile) {
  return datalib.read(readFile(inputFile), { type: 'csv', parse: 'auto' });
}
function writeJSON(outputFile, obj) {
  fs.writeFileSync(outputFile, JSON.stringify(obj, null, 2), 'utf8');
}

var database = {
  courseMetaData: [],
  personMetadata: [],
  personCourseActivities: []
};

var courses = [
  {
    'id': 'MITProfessionalX+SysEngxB1+3T2016',
    'title': 'Architecture of Complex Systems, Fall 2016',
    personMetadata: 'sow1-ACS-course1-HERE/analysis/studentActivity/MITProfessionalX+SysEngxB1+3T2016-1565_std-generalActivity.csv',
    personCourseActivities: [
      'sow1-ACS-course1-HERE/networks/lt-data/person1.json',
      'sow1-ACS-course1-HERE/networks/lt-data/person2.json',
      'sow1-ACS-course1-HERE/networks/lt-data/person3.json',
      'sow1-ACS-course1-HERE/networks/lt-data/person4.json',
      'sow1-ACS-course1-HERE/networks/lt-data/person5.json',
    ]
  },
  {
    'id': 'MITxPRO+AMxB+1T2018',
    'title': 'Additive Manufacturing, Sprint 2018',
    personMetadata: 'sow2-AM-course/analysis/studentActivity/MITxPRO+AMxB+1T2018-auth_users-LTN-set.csv',
    personCourseActivities: [
      'sow2-AM-course/networks/LTN-Set/Person1.json',
      'sow2-AM-course/networks/LTN-Set/Person2.json',
      'sow2-AM-course/networks/LTN-Set/Person3.json',
      'sow2-AM-course/networks/LTN-Set/Person4.json',
      'sow2-AM-course/networks/LTN-Set/Person5.json',
      'sow2-AM-course/networks/LTN-Set/Person6.json',
      'sow2-AM-course/networks/LTN-Set/Person7.json',
      'sow2-AM-course/networks/LTN-Set/Person8.json',
      'sow2-AM-course/networks/LTN-Set/Person9.json',
      'sow2-AM-course/networks/LTN-Set/Person10.json',
      'sow2-AM-course/networks/LTN-Set/Person11.json'
    ]
  }
];

courses.forEach((course) => {
  database.courseMetaData.push({
    id: course.id,
    title: course.title
  });
  var activities = course.personCourseActivities.map((f) => path.resolve(BASE_DIR, f)).map(readJSON);
  var userIds = {};
  activities.forEach((a) => {
    userIds[a.name[0]] = true
    database.personCourseActivities.push(a);
  });

  var metadata = readCSV(path.resolve(BASE_DIR, course.personMetadata));
  metadata.forEach((md, index) => {
    if (md.id && !md.user_id) {
      // Modifications to new CSV format to be compatible with the old one.
      md.grade = md.percent_grade;
      md.user_id = activities[parseInt(md.id.replace(/Person/,''), 10)-1].name[0];
    }
    if (userIds[md.user_id]) {
      database.personMetadata.push(md);
    }
  });
});

writeJSON(output, database);
