import boto3
import json

def lambda_handler(event, context):
	dynamo = boto3.client('dynamodb')
	print(event)
	
	data_string = event["queryStringParameters"]["getDataString"].encode('utf-8')
	data = json.loads(data_string)
	print(data)
	print(type(data))
	
	response = dynamo.get_item(
		TableName='wifiUsers',
		Key={
			'email': {
				'S': data["email"]
			}
		}
	)
	print(response)
	
	if not "Item" in response:
		json_response = {
			"statusCode": 404,
			"headers": {
				"Access-Control-Allow-Origin": "*"
			},
			"body": "Email not found"
		}
	else:
		password = str(hash(data["password"]))
		if password == response["Item"]["password"]["S"]:
		    
			json_response = {
				"statusCode": 200,
				"headers": {
					"Access-Control-Allow-Origin": "*"
				},
				"body": str(json.dumps(response))
			}
		else:
			json_response = {
				"statusCode": 401,
				"headers": {
					"Access-Control-Allow-Origin": "*"
				},
				"body": "Incorrect password"
			}
	print(json_response)
	return json_response
