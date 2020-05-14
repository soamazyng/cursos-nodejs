#!/usr/bin/env bash
#para quem so tem um profile no aws cli remover essa parte "--profile maxxidata"
sudo $(aws ecr get-login --no-include-email --region us-east-2 --profile default)
sudo docker build --no-cache -t har-harvest-api .
sudo docker tag har-harvest-api:latest 154157975196.dkr.ecr.us-east-2.amazonaws.com/har-harvest-api:latest
sudo docker tag har-harvest-api:latest 154157975196.dkr.ecr.us-east-2.amazonaws.com/har-harvest-api:v0.67.0
sudo docker push 154157975196.dkr.ecr.us-east-2.amazonaws.com/har-harvest-api:latest
sudo docker push 154157975196.dkr.ecr.us-east-2.amazonaws.com/har-harvest-api:v0.67.0
