# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo docker run hello-world

sudo -i

gcloud auth configure-docker --quiet

docker run -d -p 2181:2181 --env ZOOKEEPER_CLIENT_PORT=2181 --env ZOOKEEPER_TICK_TIME=2000 confluentinc/cp-zookeeper

docker run -d -p 9092:9092 --env KAFKA_ZOOKEEPER_CONNECT=34.93.123.211:2181  --env KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://34.93.123.211:9092  --env KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1  confluentinc/cp-kafka

docker run -d -p 5434:5432 --env POSTGRES_USER=postgres --env POSTGRES_PASSWORD=123 --env POSTGRES_DB=nest postgres

docker run -d -p 8080:8080 ghcr.io/conduitio/conduit