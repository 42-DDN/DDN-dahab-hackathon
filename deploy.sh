KEY_PATH="$HOME/Documents/key1.pem"
USER="admin"
HOST="ec2-56-228-19-249.eu-north-1.compute.amazonaws.com"
GITHUB_REPO="https://github.com/42-DDN/DDN-dahab-hackathon"
REMOTE_DIR_NAME="DDN-dahab-hackathon"



echo "🔐 Connecting to EC2 and setting up the project..."
ssh -i "$KEY_PATH" $USER@$HOST << EOF
  echo "✅ Connected to EC2 : SUCCESS"
  sudo apt update
  sudo apt install -y git make docker.io nodejs npm
  git clone "$GITHUB_REPO"
  cd "$REMOTE_DIR_NAME"
  echo "RUNNING UP THE DOCKER CONTAINERS"
  sudo make up
EOF

