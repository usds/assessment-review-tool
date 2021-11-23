#!/bin/bash
tar czf keys.tar.gz keys
openssl enc -aes-256-cbc -salt -in keys.tar.gz -out keys.enc
rm keys.tar.gz

