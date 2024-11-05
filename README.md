## APIs Lambda and S3

Created a web service using AWS for storing and retrieving JSON data.

AWS Setup: A public S3 bucket (my-json-storage-bucket) was created for JSON file storage, and an API Gateway was configured with POST and GET endpoints.

POST Endpoint: A Lambda function was developed to accept JSON data, validate it, store it in S3, and return the e_tag and S3 file URL.

GET Endpoint: Another Lambda function retrieved all JSON files from S3, compiled their contents, and returned the data.

Testing: We tested the endpoints using Postman to ensure proper storage and retrieval, with error handling for invalid JSON inputs and S3 access issues.






