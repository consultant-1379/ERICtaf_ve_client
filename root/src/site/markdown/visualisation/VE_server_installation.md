#Visualization Engine Server Installation & Operation


###Installation

Use existing installation

A node.js installation is required on the machine hosting the server. Npm (node package manager) must be in the path. Npm is automatically installed togheter with node.js. In the root folder of the server there is a makefile. It has two targets for installing, install and install-dev. The difference is that make install-dev will download dependencies for running server tests while make install only installs the production environment. Both targets will create two folders and then start the downloading and installing of dependencies. The dependencies can be viewed in the package.json file.

Links to node, npm and forever are installed under /home/eduraci/bin. It is also set on eduraci's path variable.

**Note:** The cluster function that allows the server to run on more than one core requires a redis data store installed to allow the processes to communicate with each other. Currently the makefile does not setup this redis store. A redis store is running on esekilxxen506 and esekilxxen507. It can be started with this command

**/proj/DuraCIArch/wmr/esekilxxen506/redis/redis-2.6.11/src/redis-server &**

Install your own

### Node

Get node, unpack and compile:


<pre>$ wget http://nodejs.org/dist/v0.10.18/node-v0.10.18.tar.gz
$ tar xzvf node-v0.10.18.tar.gz
$ cd node-v0.10.18
$ ./configure --prefix=/home/$USER/local
$ make
$ make install </pre>

###Redis

Download, compile and install:

<pre>$ wget http://redis.googlecode.com/files/redis-2.6.14.tar.gz
$ tar xzf redis-2.6.14.tar.gz
$ cd redis-2.6.14
$ make
$ make test
$ cd src
$ file * | grep executable | awk -F: '{print $1}' | xargs cp -t /home/$USER/local/bin/ </pre>

If you try to compile redis on 32 bit system then you need to update corresponding line in (REDIS_INSTALL_DIR)/src/.make-settings as shown below.


CFLAGS=-march=i686

Add npm, node and redis to your path

There are several ways to do this. This one sets up some symbolic links:


<pre><code>$ mkdir /home/$USER/bin
$ cd /home/$USER/bin
$ ln -s ../local/bin/node node$ ln -s ../local/bin/npm npm
$ ln -s ../local/bin/redis-server redis-server
$ ln -s ../local/bin/redis-cli  redis-cli
$ setenv PATH ${PATH}:/home/${USER}/bin
# Or if bash is your shell
$ export PATH=$PATH:/home/${USER}/bin/
</code></pre>

###Forever

Install and add link to path:


<pre>$ cd /home/${USER}/local/lib$ npm install forever
$ cd /home/${USER}/bin
$ ln -s ../local/lib/node_modules/forever/bin/forever forever
</pre>

In case the machine doesn't have direct access to the internet it might be necessary to add proxy settings to npm before forever can be downloaded.


<pre>$ npm config set proxy http://www-proxy.ericsson.se:8080
$ npm config set https-proxy http://www-proxy.ericsson.se:8080 </pre>

Fetch the source code from git

Clone the VE sources from git repo and checkout the development branch. Optionally create a separate folder for the VE installation first.

There might be an issue when using git versions older than 1.7


<pre><code>$ cd
$ git clone ssh://(YOUR_USER)@gerritforge.lmera.ericsson.se:29418/duraci-ve
$ cd duraci-ve
$ git checkout development </code></pre>

Run VE install script

Switch to the server directory and run the VE server install script to create dirs and get dependencies.

<pre> $ cd server
$ make install </pre>

To run the server unit tests install the development dependencies instead


<pre>$ cd server
$ make install-dev </pre>

###Start Redis

You will get some warnings about file limits and memory but it should be ok.

<pre>$ redis-server </pre>

After starting the server, as described in Operations below, the client should be available at http://(your host):8080/root/

##Operation

In normal operation the server should be run as a daemon. This can be acheived by the node.js tool 'forever'. It will monitor the process and restart it in case of a crash.

###Important

Before you go ahead and start the server open the duraci-ve/server/config/config.js file. In the messageBus section you must change the host, port, exchange and bindingKey values to reflect the message bus you are using.

###Start

The most basic way to start the server is by executing the command



<pre> $ node server.js </pre>

in the duraci-ve/server folder. This will make the server start running in the foreground of the current terminal.


To start the server as a daemon, which is the recommended way, use forever like this

<pre><code>
$ forever start -a -l (path to server)/logs/forever.log -e (path to server)/logs/error.log server.js </code></pre>

To verify the server is running execute

<pre><code> $ forever list </code></pre>

Below is an example output from this command. The interesting information to note is the uid, it will be used to stop or restart the server.

info:    Forever processes running
data:        uid  command                                                                 script    forever pid   logfile                                                                            uptime
data:    [0] Zf2h /proj/DuraCIArch/wmr/esekilxxen506/node/node-v0.10.0-linux-x64/bin/node server.js 9466    27146 /proj/DuraCIArch/wmr/esekilxxen507/node/VisualisationEngineServer/logs/forever.log 3:17:45:53.150



To verify that the server have successfully connected to the message bus open the log file located at duraci-ve/server/logs/server.log. You should see some lines like this

[2013-09-18 04:31:48.017] [INFO] veserver - Connected to MB
[2013-09-18 04:31:48.246] [INFO] veserver - Queue amq.gen-uNW0MGuV6KPm2D8qaFisyg is open
[2013-09-18 04:31:48.360] [INFO] veserver - Bind queue to wmr.rnc.debug exchange done

When eiffel messages are received from the message bus you will see log lines like this, granted the logLevel is still set to DEBUG

[2013-09-18 04:35:55.289] [DEBUG] veserver - Message from MB: {"eiffelMessageVersions":{"2.1.2.0.16":{"domainId":"kista","eventId":"c0d9cf55-d377-4465-ab26-521e500a7340","eventTime":"2013-09-18T10:35:54.000Z","eventType":"EiffelBaselineDefinedEvent","inputEventIds":["393cd2cf-92d4-4c92-a45e-f2a0b7c0e5a1"],"eventData":{"baselineName":"rnc,main,89.1,lm","baselineIdentifiers": [],"consistsOf": [],"context": {"environment": [],"dependencies":[]},"optionalParameters":{"org":"rnc","proj":"main","increment":"89.1","revision":"R89B","dw2base":"R1A03","lm":"rncLmUe","label":"CXC1735930-R89B14","version":"R89B14","arc_profile": "1","forced":"false","eventSource":"rncLmUe","cis_sim":"false","cis_debug":"false"}}}}}

###Restart

Forever monitors the server process and restarts it automatically if it's found not running, so it's not necessary to manually restart the server in case of a crash. If the server code changes it is however necessary to manually restart the server, this is done by the command

<pre>$ forever restart (uid) </pre>

So for the example above it would be 'forever restart Zf2h'

###Stop

To stop a server running in daemon mode execute

<pre> $ forever stop (uid) </pre>

Example, 'forever stop Zf2h'

###Logging

At the moment four logs are produced. Forever logs to forever.log and all unhandled exceptions and unexpected error messages from server.js is written to error.log. Connections.log logs all incoming http requests, this one is growing quite rapidly and I'm not sure it's necessary. Server.log is the main log from the server containing info, debug and error messages.

###Configuration

The server reads some configuration data from duraci-ve/server/config/config.js. It is possible to set which port the server is listening on, where to store the logs and which message bus to connect to. The server must be restarted if any changes are made to this file.

###Example config.js

<pre>server: {
    port: 8080,
    logDir: "logs",
    logFile: "server.log",
    logLevel: "DEBUG",
    eventSource: "RabbitMQ"
},
messageBus: {
    host: "esekilxxen507.rnd.ericsson.se",
    port: 5673,
    exchange: "ci",
    bindingKey: "kista.#",
    queueNamePostfix: ""
},
eiffel: {
    supportedVersion: 2
},
test: {
    port: 8585
} </pre>



###Unit tests

To run unit tests execute 'make test' in the root folder. Note that the server have to be installed with 'make install-dev' to have all dependencies required for executing unit tests.
