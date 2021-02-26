const dynamodb = require('./dynamo-client')

// what could you do to improve performance?
const dynamoClient = dynamodb.getDynamo()

const tableName = 'SchoolStudents';
const studentLastNameGsiName = 'studentLastNameGsi';

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.studentId
 * @param {string} [event.studentLastName]
 */
exports.handler = (event) => {
  // T̶O̶D̶O̶ use the AWS.DynamoDB.DocumentClient to write a query against the 'SchoolStudents' table and return the results.
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
  // T̶O̶D̶O̶ (extra credit) if event.studentLastName exists then query using the 'studentLastNameGsi' GSI and return the results.
  // T̶O̶D̶O̶ (extra credit) limit the amount of records returned in the query to 5 and then implement the logic to return all
  //  pages of records found by the query (uncomment the test which exercises this functionality)

  return new Promise((resolve, reject) => {
    const { schoolId, studentId, studentLastName } = event;
    let params;
    if (schoolId && studentId) {
      params = {
        RequestItems: {
          'SchoolStudents': {
            Keys: [
              { schoolId, studentId }
            ]
          }
        }
      }

      dynamoClient.batchGet(params, (err, data) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(data.Responses.SchoolStudents)
        }
      })
    } else if (studentLastName) {
      params = {
        TableName: tableName,
        IndexName: studentLastNameGsiName,
        FilterExpression: 'studentLastName = :studentLastName',
        ExpressionAttributeValues: {
          ':studentLastName': studentLastName
        }
      };

      dynamoClient.scan(params, (err, data) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(data.Items)
        }
      });
    } else if (schoolId && !studentId) {
      params = {
        TableName: tableName,
        KeyConditionExpression: 'schoolId = :schoolId',
        ExpressionAttributeValues: {
          ':schoolId': schoolId
        },
        Limit: 5
      };
      const dataResult = [];

      function doQuery(p) {
        dynamoClient.query(p, (err, data) => {
          if (err) {
            reject(new Error(err))
          } else {
            data.Items.forEach(item => dataResult.push(item))

            if (dataResult.length === 10) {
              resolve(dataResult)
            } else {
              const newParams = {
                ...params,
                ExclusiveStartKey: data.LastEvaluatedKey
              }
              doQuery(newParams)
            }
          }
        })
      }
      doQuery(params);
    } else {
      reject(new Error('incorrect query'));
    }
  });
};
