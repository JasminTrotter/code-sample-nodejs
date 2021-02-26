const dynamodb = require('./dynamo-client')

// what could you do to improve performance?
const dynamoClient = dynamodb.getDynamo()

const tableName = 'SchoolStudents';

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.schoolName
 * @param {string} event.studentId
 * @param {string} event.studentFirstName
 * @param {string} event.studentLastName
 * @param {string} event.studentGrade
 */
exports.handler = (event) => {
  // T̶O̶D̶O̶ validate that all expected attributes are present (assume they are all required)
  // T̶O̶D̶O̶ use the AWS.DynamoDB.DocumentClient to save the 'SchoolStudent' record
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).

  return new Promise((resolve, reject) => {
    const expectedAttributes = [
      'schoolId',
      'schoolName',
      'studentId',
      'studentFirstName',
      'studentLastName',
      'studentGrade'
    ];
    const missingAttributes = expectedAttributes.reduce((missing, attribute) => {
      if (!event[attribute]) {
        missing.push(attribute)
      }
      return missing
    }, []);

    if (missingAttributes.length) {
      reject(new Error(`missing attributes: ${missingAttributes}`))
    }

    const params = {
      RequestItems: {
        'SchoolStudents': [
          {
            PutRequest: {
              Item: { ...event }
            }
          }
        ]
      }
    };

    dynamoClient.batchWrite(params, (err, data) => {
      if (err) {
        reject(new Error(err))
      } else {
        resolve(data)
      }
    });
  });
};
