const AWS = require('aws-sdk');

let dynamodb;
module.exports = {
  getDynamo: () => {
    if (dynamodb) return dynamodb;

    dynamodb = new AWS.DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
      endpoint: new AWS.Endpoint('http://localhost:8000'),
      region: 'us-west-2',
      accessKeyId: 'fakeKeyId',
      secretAccessKey: 'fakeSecretAccessKey',
    });
    return dynamodb;
  }
} 
