#!/bin/bash

# models_generator - generates typescript models from database

################################################################################
# Help                                                                         #
################################################################################
Help()
{
   # Display Help
   echo "Generates models from database using sequelize-auto."
   echo
   echo "Syntax: models_generator -h somehost -d somedatabase -u someuser -x somepassword -p someport "
   echo
}

while getopts ":h:d:u:x:p:" flag
do
	case "${flag}" in
		h) host=${OPTARG};;
		d) database=${OPTARG};;
		u) user=${OPTARG};;
		x) password=${OPTARG};;
		p) port=${OPTARG};;
		\?) Help
			exit;;
	esac
done

echo "Generating Models:"
echo "Host: $host:$port"
echo "Database $database"
echo "User: $user"

npm update

./node_modules/sequelize-auto/bin/sequelize-auto -h $host -d $database -u $user -x $password -p $port --dialect postgres -l ts -o models --cm p --cf l

echo "New Models in models Folder"
