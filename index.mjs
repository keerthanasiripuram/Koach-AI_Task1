import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const BUCKET_NAME = 'bucket-json-holder';
export const handler = async (event) => {
    console.log("Event received:", JSON.stringify(event, null, 2)); 
    try {

        console.log("HTTP Method:", event.httpMethod); 

        if (event.httpMethod === 'POST') {
            // POST request to save data to S3
            console.log(typeof event.body)
            const body = JSON.parse(JSON.stringify(event.body));
            console.log("Parsed Body:", body); 
            const timestamp = Date.now().toString();
            const params = {
                Bucket: BUCKET_NAME,
                Key: `data-${timestamp}.json`, 
                Body: JSON.stringify(body),
                ContentType: "application/json"
            };

            console.log("S3 putObject params:", params); 

            const s3Response = await s3.putObject(params).promise();
            console.log("S3 putObject response:", s3Response); 

            return {
                statusCode: 200,
                body: JSON.stringify({
                    e_tag: s3Response.ETag,
                    url: `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`
                })
            };
        } else if (event.httpMethod === 'GET') {
            // GET request to retrieve data from S3
            const params = {
                Bucket: BUCKET_NAME,
            };
            console.log("S3 listObjectsV2 params:", params); 

            const s3Objects = await s3.listObjectsV2(params).promise();
            console.log("S3 listObjectsV2 response:", s3Objects); 

            const dataPromises = s3Objects.Contents.map(async (item) => {
                const objectParams = {
                    Bucket: BUCKET_NAME,
                    Key: item.Key
                };
                console.log("S3 getObject params:", objectParams); 

                const data = await s3.getObject(objectParams).promise();
                console.log(`S3 getObject response for ${item.Key}:`, data); 

                return JSON.parse(data.Body.toString('utf-8'));
            });

            const allData = await Promise.all(dataPromises);
            console.log("All retrieved data:", allData); 

            return {
                statusCode: 200,
                body: JSON.stringify(allData)
            };
        } else {
            console.log("Unsupported HTTP method:", event.httpMethod); 

            return {
                statusCode: 400,
                body: JSON.stringify({ message: `Unsupported HTTP method: ${event.httpMethod}` })
            };
        }
    } catch (error) {
        console.error("Error occurred:", error); 
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
