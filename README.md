![Bmr](/app/img/logo.png)
===

**Bmr** is a Bitmessage client written in [Node.js](http://nodejs.org) using the [node-webkit](https://github.com/rogerwang/node-webkit/) desktop application framework.
It is a self-contained Bitmessage client for reading messages that you can run on your desktop and connect to your Bitmessage server.

Bmr is available for Linux, Mac and Windows desktops.

The goal of Bmr is to provide a better Bitmessage user experience than the default client.

### Official Releases

Bmr is in active development: [Bmr-v0.0.3](https://github.com/chovy/bmr/releases/tag/0.0.3) is the current release version.

Download, unzip and double-click on "Bmr" app.

* [Linux-32](https://github.com/chovy/bmr/releases/download/0.0.3/Bmr-v0.0.3-linux32.tgz)
* [Linux-64](https://github.com/chovy/bmr/releases/download/0.0.3/Bmr-v0.0.3-linux64.tgz)
* [Mac](https://github.com/chovy/bmr/releases/download/0.0.3/Bmr-v0.0.3-mac.zip)
* [Windows](https://github.com/chovy/bmr/releases/download/0.0.3/Bmr-v0.0.3-win.zip)

It is advised you **always use an SSH tunnel to your Bitmessage server when running Bmr remotely** (see security section below).

Please help improve Bmr by filing bugs or sending in feature requests to the Github issue tracker. You can also ask in the Bmr support channel:

    Passphrase: Bmr
    Address: BM-2cXEHofo7LieKNGNmAPypDUej9BRQvuFYS

### Installation

#### Bitmessage PyBitmessage (server - required)

You must already have the Bitmessage [PyBitmessage](https://github.com/Bitmessage/PyBitmessage) server API running locally with api enabled (see the instructions for [installation](https://bitmessage.org/wiki/Compiling_instructions)).

Find your `keys.dat` file:

    # Linux
    ~/.config/PyBitmessage/keys.dat

    # Mac
    ~/Library/Application Support/PyBitmessage/keys.dat

    # Windows
    C:\Users\[Username]\AppData\Roaming\PyBitmessage\keys.dat

Add the following lines to the bottom of the `[bitmessagesettings]` section:

    [bitmessagesettings]
    #...other config options
    apienabled = true
    apiport = 8442
    apiinterface = 0.0.0.0
    apiusername = edward
    apipassword = 5n0wd3n

If you want to run PyBitmessage in Daemon mode without the PyQT client starting, add `daemon = true` to `[bitmessagesettings]`.

#### Bmr (client -- this app)

##### Official release

Download the latest [Bmr release](https://github.com/chovy/bmr/releases) for your platform (Windows, Linux, Mac).

##### Optionally running from source (developers only)

To run Bmr from source (to track development inbetween releases), you first need to [download node-webkit](https://github.com/rogerwang/node-webkit#downloads) on your system.

You will need node.js installed on your system to run the 'npm install' command. You can download it from http://nodejs.org or install with [brew](http://brew.sh).

To install Bmr, you need to clone the git repository:

    git clone https://github.com/chovy/bmr.git
    cd ./bmr/app
    npm install

Once you download the `node-webkit` binary, just copy it into the `./bmr/app` directory and then double-click it to launch Bmr.

To update the code just type `git pull`.

##### Building the app

If you are running from source, you will need to build the app. Specifically you will need to compile the CSS and Handlebars templates. First, `cd ./bmr`

    grunt sass
    grunt shell:handlebars

If you are developing and want to automatically compile the CSS and templates when you modify files, you can use the grunt watch task:

    grunt watch

Whenever you modify .sass files or .tpl files, the grunt task will precompile the CSS and templates.js files automatically.

Bmr has been tested with MacOS 10.8.4, but these steps should work for Linux too.

If anyone can get this to work on Windows, let me know the steps and I'll add them here.

### Tips and Tricks

Below is a list of some of the hidden features in Bmr.

#### Meta filters

In the search filter fields on Inbox and Sent box you can type the following meta filters to search specific fields:

    :unread
    :read
    :to <bm-address-partial>
    :from <bm-address-partial>
    <subject-partial>

#### Selecting messages in Inbox

On tables, you can multi select ranges of items by holding the "shift" key, then checking another box a few rows down.
You can also hold the "cmd" (mac), "ctrl" (win/linux) key and click the "select all" checkbox to invert the selection.

#### Join a "chan" or DML in Bmr:

 1. click on `identities` tab
 2. `create deterministic address` with channel name as the `passphrase`
 3. `subscribe` to this address (copy from bottom of `identities` page) giving it a label (usually the passphrase).

The API doesn't support joining a channel yet. Its on the todo list to write a function that will do the above steps for you.

#### Context menus in messages

Right click on any message body to get more choices:

* quote selected text in reply
* search Google for selected text
* translate selected text using Google translate

#### Settings

On the settings page you can define an optional proxy service to pass links through that appear in the message body next to links `[proxy]`.

You can also choose an audio file to play when a message arrives in your Inbox.

### Discussion and support channel

Join the Bmr channel:

    Passphrase: Bmr
    Address: BM-2cXEHofo7LieKNGNmAPypDUej9BRQvuFYS

### A note about security: using the Bitmessage API remotely

It is insecure to use a remote Bitmessage API directly, as all XMLRPC API calls go over the web using http in cleartext.
That means when your Inbox is downloaded, or when you send a message, the content goes out over the web in plain text (unencrypted).

To protect against this, it is better to **open an SSH tunnel to the host your PyBitmessage API/server is running on**. You can forward a local port on your computer to a destination port (typically 8442) on the server (you only need to open up port 8444 in your firewall on the server to transmit to and from the Bitmessage peers, you do not need to open up port 8442 for the API, as the tunnel will connect locally to it on the server).

 This command will forward port 8422 on your local computer to port 8442 on the server, using SSH as a tunnel (typically port 22) to your Bitmessage server host:

    ssh -N -L 8442:localhost:8442 <remote-bitmessage-server-hostname>

When you login to Bmr locally, just use `localhost` as the hostname and port `8442`. This will encrypt all communication to the API using SSH before it leaves your computer. You can use whatever port you want locally (the first port defined above).

**For windows**: use [Putty](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html) and setup an SSH tunnel for Source port `8442` and Destination `localhost:8442` under `Tunnels`. Then connect normally to your host via SSH `Session`

By doing this, you are effectively making the API calls directly on the server over SSH. So they are not going out over the web using http to the API.

### Screenshots

Login to PyBitmessage server (use SSH tunnel for remote access):

![Login](/screenshots/login.png)

Compose a new message:

![Compose](/screenshots/compose.png)

Read a new message:

![Read](/screenshots/read-message.png)

Reply to a message:

![Reply](/screenshots/reply.png)

Subscriptions list:

![Subscriptions](/screenshots/subscriptions.png)

Filter inbox using the meta filter ":unread":

![Filter](/screenshots/filter-unread.png)

Search or quote highlighted text:

![Message context menu](/screenshots/message-contextmenu.png)

Optionally render HTML in messages:

![Render HTML](/screenshots/render-html.png)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/chovy/bmr/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

