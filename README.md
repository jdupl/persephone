# Perséphone

Perséphone is a Web UI that allows you to search torrents on multiple torrent websites. It can then send the desired torrents to your favorite BitTorrent client's Web UI.

## TODO
* Add more search engines.
* ~~Implement a more efficient data transfer API. (right now it's very inefficient)~~
* Chase down possible memory leaks as this is likely to run for long periods of time.
* Create a settings angular page allowing to tweak the UI and behavior of the application.
* Reduce memory footprint as much as possible.
* Add the ability to pause/resume/purge searches.
* Create init scripts for various operating systems and init systems.
* Create bridges to BitTorrent clients Web UIs.
* Implement sessions/logins.
* Add `https` support.
* Create a better README with screenshots and features description.

*Those TODOs aren't in priority order.*

## Installation procedureo
Make sure you have nodejs 0.10 and npm installed.
* Clone the repo `git clone https://github.com/SBSTP/persephone.git`.
* Checkout the right tag (version) `git checkout v0.0.0`.
* Install the dependencies `npm install`.
* `node app.js` should start Perséphone.

Also, startup script (for debian based operating systems) is available in the `tools` folder.
* Set the `DAEMON_ARGS` variable to the `path/to/app.js`.
* Set the `USER` variable to the name of the user who should own the daemon.
* Once you're done, copy `persephone.sh` to `/etc/init.d/persephone`.
* make it executable, `sudo chmod 755 /etc/init.d/persephone`.
* register it, `sudo update-rc.d persephone defaults`.
Perséphone should now boot when you start your computer. You can manually control persephone with the `service persephone (start|stop|restart)` command.

## License
Use this at your own risk. The Perséphone project and its authors are not responsible for the content you download with it.

The code is licensed under the GPL, see the [LICENSE](LICENSE) file.
