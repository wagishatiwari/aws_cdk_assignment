# Person service Serverless - Serverless Application with AWS CDK
Person service stores information about persons and allows users of its API
to create new persons and list existing persons.

_Infrastructure as code framework used_: AWS CDK
_AWS Services used_: AWS Lambda, AWS DynamoDB, AWS SNS, AWS API Gateway

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Requirements

- AWS CLI already configured with Administrator permission
- AWS CDK - v2
- NodeJS 20.x installed
- CDK bootstrapped in your account
## Deploy this project

Deploy the project to the cloud:

```
cdk synth
cdk deploy
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `NODE_ENV=dev cdk deploy --all`  deploy this stack to your default AWS account/region
* `NODE_ENV=dev npx cdk diff`    compare deployed stack with current state
* `NODE_ENV=dev npx cdk synth`   emits the synthesized CloudFormation template


## API

### Create a person

```https://<api-gateway-id>.execute-api.eu-west-1.amazonaws.com/prod/persons```

```json
    {
      "firstName":"Wagisha",
      "lastName": "Tiwari",
      "phoneNumber": "123456789",
      "address": "Amsterdam"
    }
```

### Get all persons

```https://<api-gateway-id>.execute-api.eu-west-1.amazonaws.com/prod/persons```

