export KEYDATE=$(date +"%m-%d-%y")


for KEY in dev stage prod
do
    openssl req -nodes -x509 -days 365 -newkey rsa:2048 -keyout ${KEY}_private_${KEYDATE}.pem -out ${KEY}_public_${KEYDATE}.crt -subj "/C=US/ST=District of Columbia/L=Washingtonq/O=Office of Management and Budget/OU=United States Digital Service/CN=usds.gov/emailAddress=Kelvin.T.Luu@omb.eop.gov"
    openssl rsa -in ${KEY}_private_${KEYDATE}.pem -out ${KEY}_private_${KEYDATE}.key
done