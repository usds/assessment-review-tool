FROM ubuntu:18.04

WORKDIR /
RUN curl -s https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add -
RUN echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list
RUN apt-get install -y cf7-cli


ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]