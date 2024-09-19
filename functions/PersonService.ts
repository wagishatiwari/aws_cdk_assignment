import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import {DynamoDB,SNS} from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();
const TABLE_NAME : string = process.env.PERSON_TABLE_NAME!;

export const createPersonHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const {firstName, lastName, phoneNumber, address} = body;

        const id = Math.random().toString(36).substring(2, 15);

        await dynamo.put({
            TableName: TABLE_NAME,
            Item: {id, firstName, lastName, phoneNumber, address}
        }).promise();

        await publishPersonCreatedEvent({ id, firstName, lastName, phoneNumber, address });

        return {
            statusCode: 201,
            body: JSON.stringify({id})
        };
    }
    else if(event.httpMethod === 'GET'){
        const result = await dynamo.scan({ TableName: TABLE_NAME }).promise();

        const persons = result.Items.map(item => {
            const { id, firstName, lastName, phoneNumber, address } = item;
            return { id, firstName, lastName, phoneNumber, address };
        });

        return {
            statusCode: 200,
            body: JSON.stringify(persons)
        };
    }
    return {
        statusCode: 201,
        body: JSON.stringify("not supported")
    };

};

async function publishPersonCreatedEvent(person: any) {
    const sns = new SNS();

    const message = {
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        phoneNumber: person.phoneNumber,
        address: person.address
    };

    return sns.publish({
        TopicArn: process.env.TOPIC_ARN,
        Message: JSON.stringify(message)
    }).promise();
}

// 1. split post and get to two diff handlers or controllers
// 2. refactor code to use small fn to dynamo and sns
// 3. test cases