#!/bin/bash

echo "Building React app..."
cd client
npm run build
cd ..

echo "Creating deployment package..."
mkdir -p deploy
cp -r server/* deploy/
cp -r client/build deploy/public

echo "Deployment package ready in 'deploy' folder"
echo "Upload this folder to your server via FTP/SCP"