#/bin/sh
#This Script runs in .github/workflows/build-deploy.yml step-name: "Get runner public ip"
#Checks the ip of the machine/runner executing this script.
#If one IP fails to answer an IP use secondary api
if expr "$(curl -s https://ipinfo.io/ip)" : '[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*$' >/dev/null; then
  echo "$(curl -s https://ipinfo.io/ip)"
else
  echo "$(curl -s https://api.ipify.org)"
fi