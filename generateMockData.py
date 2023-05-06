import json

data = []

for i in range(1, 501):
    item = {
        "id": i,
        "name": f"Product {i}",
        "description": f"Lorem ipsum dolor sit amet, consectetur adipiscing elit for Product {i}."
    }
    data.append(item)

# Save data to JSON file
with open('mockData.json', 'w') as file:
    json.dump(data, file)