import * as jsforce from 'jsforce';
import 'source-map-support/register';
import { Buffer } from 'buffer';
import { KinesisStreamEvent, KinesisStreamHandler } from 'aws-lambda';

export const index :KinesisStreamHandler = async (event :KinesisStreamEvent): Promise<any> => {
    interface AgentStatus {
        ContactId__c: String,
        Username__c: String,
        ContactState__c: String,
    }
    let eventList: AgentStatus[] = [];
    for(const record of event.Records){
        const base64Record = record.kinesis.data;
        const decodedRecord = JSON.parse(Buffer.from(base64Record, 'base64').toString());
        if(decodedRecord.EventType != "HEART_BEAT" && decodedRecord.CurrentAgentSnapshot.Contacts.length > 0){
            eventList.push({
                ContactId__c : decodedRecord.CurrentAgentSnapshot.Configuration.ContactId,
                Username__c : decodedRecord.CurrentAgentSnapshot.Contacts[0].Username,
                ContactState__c : decodedRecord.CurrentAgentSnapshot.Contacts[0].State
            });
        }
    }

    const conn = new jsforce.Connection({
        loginUrl: process.env.LOGIN_URL
    });
    await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD);
    conn.sobject("AmazonConnectAgentEvent__e").insert(eventList);

    return {
        eventRecords : eventList
    };
}