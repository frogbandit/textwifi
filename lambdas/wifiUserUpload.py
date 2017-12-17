import boto3
import json

def lambda_handler(event, context):
	dynamo = boto3.client('dynamodb')
	
	print(event["body"])
	print(type(event["body"]))
	data_string = event["body"].encode('utf-8')
	data = json.loads(data_string)
	print(data)
	print(type(data))
	response = dynamo.get_item(
		TableName='wifiUsers',
		Key={
			'email': {
				'S': data["email"],
			}
		}
	)
	
	if not "Item" in response:
		email = data["email"]
		password = str(hash(data["password"]))
		phone = data["phone"]
		response = dynamo.put_item(
			TableName='wifiUsers', 
			Item={
				'email':{'S':email},
				'password':{'S':password},
				'phone':{'S':phone}
			}
		)

	json_response = {
		"statusCode": 200,
		"headers": {
			"Access-Control-Allow-Origin": "*"
		},
		"body": str(json.dumps(response))
	}
	print(response)
	return json_response
