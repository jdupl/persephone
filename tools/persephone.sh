#!/bin/sh
### BEGIN INIT INFO
# Provides:          persephone 
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Starts Persephone
# Description:       Start persephone on start.
#                    Change DAEMON_ARGS and USER before running!
### END INIT INFO

# PATH should only include /usr/* if it runs after the mountnfs.sh script
USER=[USERNAME]
DAEMON_ARGS="/path/to/app.js"

PATH=/sbin:/usr/sbin:/bin:/usr/bin
DESC="Persephone"
NAME=persephone
DAEMON=/usr/bin/nodejs
PIDFILE=/var/run/$NAME.pid


# Exit if the package is not installed
[ -x "$DAEMON" ] || exit 0

# Load the VERBOSE setting and other rcS variables
. /lib/init/vars.sh

# Define LSB log_* functions.
# Depend on lsb-base (>= 3.0-6) to ensure that this file is present.
. /lib/lsb/init-functions

#
# Function that starts the daemon/service
#
do_start()
{
    # Return
    #   0 if daemon has been started
    #   1 if daemon was already running
    #   2 if daemon could not be started
    start-stop-daemon -c $USER -b -t --start --quiet  --exec $DAEMON  \
                                || return 1

    start-stop-daemon -c $USER -b --start --quiet --exec $DAEMON -- \
        $DAEMON_ARGS \
        || return 2
    sleep 1
}

#
# Function that stops the daemon/service
#
do_stop()
{
    start-stop-daemon -c $USER --quiet  --stop --exec $DAEMON
    sleep 2
    return "$?"
}

case "$1" in
    start)
        [ "$VERBOSE" != no ] && log_daemon_msg "Starting $DESC" "$NAME"
        do_start
            case "$?" in
                0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
                2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
            esac
    ;;
    stop)
        [ "$VERBOSE" != no ] && log_daemon_msg "Stopping $DESC" "$NAME"
        do_stop
        case "$?" in
            0|1) [ "$VERBOSE" != no ] && log_end_msg 0 ;;
            2) [ "$VERBOSE" != no ] && log_end_msg 1 ;;
        esac
    ;;
    status)
        status_of_proc "$DAEMON" "$NAME" && exit 0 || exit $?
    ;;
    restart|force-reload)
        log_daemon_msg "Restarting $DESC" "$NAME"
        do_stop
        case "$?" in
            0|1)
                do_start
                case "$?" in
                    0) log_end_msg 0 ;;
                    1) log_end_msg 1 ;; # Old process is still running
                    *) log_end_msg 1 ;; # Failed to start
                esac
            ;;
            *)
                # Failed to stop
                log_end_msg 1
            ;;
        esac
    ;;
    *)
        echo "Usage: $0 {start|stop|status|restart|force-reload}" >&2
        exit 3
    ;;
esac
