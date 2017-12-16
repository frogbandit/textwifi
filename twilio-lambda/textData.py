from twilio.rest import Client

def lambda_handler(event, context):
		print(event)
		print(context)
		# TODO implement
		
		with open('twilio_auth.txt') as f:
			lines = f.read().splitlines() 
			
		account_sid = lines[0]
		auth_token = lines[1]

		client = Client(account_sid, auth_token)

		phone = "(949)554-5535"

		#message to client
		message = client.messages.create(to=phone, from_="(509)774-2976",
				body="Here are your wifi hotspots!")
				
		response = {
				"statusCode": 200,
				"headers": {
				"Access-Control-Allow-Origin": "*"
				},
				"body": '{"success": "success"}'
		}
		
		return response
		# return 'Hello from Lambda'
