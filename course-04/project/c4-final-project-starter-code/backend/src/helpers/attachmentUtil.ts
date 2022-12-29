import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';

const logger = createLogger('S3 Attachment')

const AWSXRay = require("aws-xray-sdk");

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
    signatureVersion: "v4",
  });

export function createAttachmentPresignedUrl(todoId: string): string {
    logger.info(`Call createAttachmentPresignedUrl with todoId=${todoId}`)
    const bucket_param = {
        Bucket: process.env.ATTACHMENT_S3_BUCKET,
        Key: todoId,
        Expires: Number(process.env.SIGNED_URL_EXPIRATION)
    }
    logger.info("Params: ", bucket_param)
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: process.env.ATTACHMENT_S3_BUCKET,
      Key: todoId,
      Expires: Number(process.env.SIGNED_URL_EXPIRATION)
    });
    logger.info(`Get signUrl=${signedUrl}, todoId=${todoId}`)
    
    return signedUrl as string;
      
  }