import { APIGatewayEvent } from 'aws-lambda';
import { createPersonHandler } from '../functions/PersonService';
import { DynamoDB, SNS } from 'aws-sdk';
import mocked = jest.mocked;
// Mock AWS SDK services
    jest.mock('aws-sdk');
    const mockDynamoDB = mocked(DynamoDB.DocumentClient);
    jest.mock('aws-sdk/clients/sns', () => {
    return {
        __esModule: true,
        default: jest.fn(() => {
            return {
                publish: jest.fn().mockReturnThis(),
                promise: jest.fn(),
            }
        }),
    };
});

describe('personHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.skip('POST method creates a person', async () => {
        const event: APIGatewayEvent = {
            httpMethod: 'POST',
            body: JSON.stringify({
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '1234567890',
                address: 'Amsterdam',
            }),
        } as any;
        const sns = new SNS();
        mockDynamoDB.prototype.put.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        } as any);


        const result = await createPersonHandler(event);

        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body)).toHaveProperty('id');
        expect(mockDynamoDB.prototype.put).toHaveBeenCalled();
        expect(sns.publish).toHaveBeenCalled();
    });

    test('GET method retrieves persons', async () => {
        const event: APIGatewayEvent = {
            httpMethod: 'GET',
        } as any;

        mockDynamoDB.prototype.scan.mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Items: [
                    { id: '1', firstName: 'John', lastName: 'Doe', phoneNumber: '1234567890', address: 'Amsterdam' },
                ],
            }),
        } as any);

        const result = await createPersonHandler(event);

        expect(result.statusCode).toBe(200);
        const persons = JSON.parse(result.body);
        expect(persons).toHaveLength(1);
        expect(persons[0]).toHaveProperty('id', '1');
        expect(mockDynamoDB.prototype.scan).toHaveBeenCalled();
    });

    test('Unsupported HTTP method returns 201', async () => {
        const event: APIGatewayEvent = {
            httpMethod: 'PUT',
        } as any;

        const result = await createPersonHandler(event);

        expect(result.statusCode).toBe(201);
        expect(result.body).toBe(JSON.stringify('not supported'));
    });
});