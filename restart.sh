while true; do
if ! pgrep -f "bouncerbot.js"
    then
        echo "Restarting node bouncerbot.js ..."
        node bouncerbot.js >> stdout.txt 2>> stderr.txt
fi
sleep 60
done