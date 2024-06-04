import { apiResponse } from "./aws_response";
import {IStorageClient} from "./aws/services/IStorageClient";
import { jsonToMapReviver, mapToJsonReplacer } from "./util/utilities";
import { IUserPoolClient } from "./aws/services/IUserPoolClient";
import { AWSStorageClient } from "./aws/impl/S3StorageClient";
import { CognitoUserPoolClient } from "./aws/impl/CognitoUserPoolClient";
import { WFTDAStatbookConverter } from "../WFTDAStatbookConverter";
import { IDynamoDbClient } from "./aws/services/IDynamoDbClient";
import { AWSDynamoDbClient } from "./aws/impl/AWSDynamoDbClient";

type DevicePayload = {id: string, deviceToken: string, timestamp: number, address: string};

export {DevicePayload}
export {IStorageClient, IUserPoolClient, IDynamoDbClient}
export {AWSStorageClient, CognitoUserPoolClient, AWSDynamoDbClient}

export {apiResponse}
export {jsonToMapReviver, mapToJsonReplacer}

export {WFTDAStatbookConverter}
