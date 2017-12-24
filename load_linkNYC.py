import sys
import csv
import certifi
from elasticsearch import Elasticsearch

def main():
	es = Elasticsearch(['https://search-textwifi-jhk6t4hsbrgwl4636zeyrabk74.us-east-1.es.amazonaws.com'], use_ssl=True, ca_certs=certifi.where())


	with open(sys.argv[1], 'rb') as f:
		freader = csv.reader(f)
		for row in freader:
			if row[6] == "Link Active!":
				hotspot = {}
				hotspot["name"] = row[0]
				hotspot["strength"] = "0"
				hotspot["location"] = {
					"lat": row[4],
					"lon": row[5]
				}
				hotspot["loc_type"] = "LinkNYC"
				print(hotspot)
				response = es.index(index='wifi', doc_type='hotspot', body=hotspot)
				print(response)
				
			else:
				print(row[0] + " is not active")

main()