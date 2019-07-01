# amazonconnect-kinesis-salesforce-integration-example
An easy example of aws lambda publishing Salesforce platform event to notify Amazon Connect agent event

## How to use
1. Specify arn of kinesis stream for agent event on serverless.yml
2. Update `handler.ts` according to your Salesforce org (Specify platform event type and fields)
3. Run `sls deploy`
4. Setup enviroment variables