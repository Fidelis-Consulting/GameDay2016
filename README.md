# Worklog

Wow, first day at Unicorn.Rentals. I found the orientation pretty cringeworthy, but someone else in my group didn't laugh at the jokes and they were fired. Yikes! Still though, the chowder taps and ball pit are the best perks I've ever had at a startup.

The old team left something running and I think my first task will be to figure out what it is doing. I think it would be cool to use Ansible to get an inventory of what's running in the AWS account. The Ansible stuff here probably needs some work, but hopefully this will be a good starting point for my team or someone else that is in the same situation!

From a quick glance I don't feel great about what is running there. There is some guy here who likes to tinker with the network stuff and insists that I call him "The Plague." He seems to hate documentation. I've been trying to ask him about what he did but he keeps muttering something about DaVinci and playing on his VR headset. 

Here's what's in this zip file:

- facts.yml: provides you some information as to what is running in your AWS environment. 
- server.py: the python server application that powers this part of unicorn.rentals. It may be a good idea to familiarize myself with the code.

### How to use


- Pip install [Ansible](http://docs.ansible.com/ansible/intro_installation.html) either on an EC2 instance or locally ```pip install ansible```


- Grab the credentials from the GameDay [dashboard](https://dashboard.cash4code.net/?tid=<YOUR_TEAMS_API_TOKEN)


- Run the command to create the EC2 assets ``` ansible-playbook -vv facts.yml```

Make note of the information it returns to you. This can show you what EC2 instances are running in your account.
For more information, visit the [Ansible documentation](http://docs.ansible.com/ansible/index.html) and [cloud module](http://docs.ansible.com/ansible/list_of_cloud_modules.html) pages


configure the instance from scratch
```
cd /usr/src/;
mkdir node;
cp node;
wget https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.xz;
tar xvf node-v6.9.1-linux-x64.tar.xz;
cd node-v6.9.1-linux-x64;
cp bin/node /usr/bin/;
ln -s /usr/src/node/node-v6.9.1-linux-x64/lib/node_modules/npm/bin/npm-cli.js /usr/bin/npm;
yum -y install git php56 php56-pecl-redis httpd24;
npm install pm2 -g

rm -rvf /var/www/html;
mkdir /data;
cd /data/;
git clone https://github.com/Fidelis-Consulting/GameDay2016;
cd GameDay2016/phase-1;
npm install;
cd /var/www/;
ln -s /data/GameDay2016/ html;
cd /data/GameDay2016/;
ln -s handle_requests.php index.php;
service httpd start;
chkconfig httpd on;

pm2 start /data/GameDay2016/sqsparser.js;
pm2 start /data/GameDay2016/backend.js;

nohup python /data/GameDay2016/s3.py &

```