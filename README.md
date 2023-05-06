# nodejs_elastic_search_api_mongodb


create a .env file at the root level of your project.


### .env file contains


## PORT=5000


## MONGO_URI=mongodb+srv://username:password@cluster0.q09x9.mongodb.net/Elastic_Learn_DB?retryWrites=true&w=majority
## ELASTIC_URI=http://localhost:9200

need to pull elastic search image


## docker pull docker.elastic.co/elasticsearch/elasticsearch:7.14.0

now create a container out of it



## docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.14.0


now run...


## npm install




now at last ....run....



## npm run dev
