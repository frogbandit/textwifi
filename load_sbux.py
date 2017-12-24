import sys
import csv
import certifi
from elasticsearch import Elasticsearch

def main():
	es = Elasticsearch(['https://search-textwifi-jhk6t4hsbrgwl4636zeyrabk74.us-east-1.es.amazonaws.com'], use_ssl=True, ca_certs=certifi.where())
	# awsauth = AWS4Auth(YOUR_ACCESS_KEY, YOUR_SECRET_KEY, REGION, 'es')

	with open(sys.argv[1], 'rb') as f:
		freader = csv.reader(f)
		next(freader, None)
		for row in freader:
			hotspot = {}
			hotspot["name"] = row[2] + " Starbucks"
			hotspot["strength"] = "0"
			hotspot["location"] = {
				"lat": float(row[20]),
				"lon": float(row[21])
			}
			hotspot["loc_type"] = "coffee"
			print(hotspot)
			response = es.index(index='wifi', doc_type='hotspot', body=hotspot)
			print(response)

main()