import 'dotenv/config';
import { r2, R2_BUCKET_NAME } from './src/lib/r2';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

async function verifyR2Connection() {
    console.log('Verifying R2 Connection...');
    try {
        const command = new ListObjectsV2Command({
            Bucket: R2_BUCKET_NAME,
            MaxKeys: 5,
        });
        const response = await r2.send(command);
        console.log('Successfully connected to R2!');
        console.log('Bucket Name:', response.Name);
        console.log('Key Count:', response.KeyCount);
        if (response.Contents) {
            console.log('Sample Objects:');
            response.Contents.forEach(obj => console.log(` - ${obj.Key} (${obj.Size} bytes)`));
        }
    } catch (error) {
        console.error('Failed to connect to R2:', error);
    }
}

verifyR2Connection();
