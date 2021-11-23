openssl enc -d -aes-256-cbc -in keys.enc -out keys.tar.gz
tar -xvf keys.tar.gz
rm keys.tar.gz
cp * ../backend/keys/