

#!/bin/bash
while [ true ] ; do

read -t 3 -n 1
if [ $? = 0 ] ; then
node matches join_match -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/id.json -l debug
else
echo 'press a button to try to win :) presently the person who presses it first AFTER the 1000s for a round is complete gets the whole pot of wsol ;) be sure to run spl-token wrap 0.5 before playing ;)'

fi
done