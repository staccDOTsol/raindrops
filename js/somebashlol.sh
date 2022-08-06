nohup ts-node cli/src/matches.ts update_match -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/id.json -l debug &
nohup ts-node cli/src/matches.ts create_or_update_oracle -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/id.json -l debug &

nohup ts-node cli/src/matches.ts join_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug &
nohup ts-node cli/src/matches.ts join_match -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/id.json -l debug &
nohup ts-node cli/src/matches.ts join_match -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/idhydra.json -l debug &
nohup ts-node cli/src/matches.ts join_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug &
nohup ts-node cli/src/matches.ts join_match -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/id.json -l debug &
nohup ts-node cli/src/matches.ts join_match -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/idhydra.json -l debug &

while :
do 

ts-node cli/src/matches.ts show_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug 
 ts-node cli/src/matches.ts join -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug 

 ts-node cli/src/matches.ts show_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug 
 ts-node cli/src/matches.ts join -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/id.json -l debug 

 ts-node cli/src/matches.ts show_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug 
 ts-node cli/src/matches.ts join -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/idhydra.json -l debug

 ts-node cli/src/matches.ts show_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug 
 ts-node cli/src/matches.ts join -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug

 ts-node cli/src/matches.ts show_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug &

 ts-node cli/src/matches.ts show_match -cp cli/example-configs/match/createMatch.json -e devnet -k aaa.json -l debug &
 ts-node cli/src/matches.ts join -cp cli/example-configs/match/createMatch.json -e devnet -k ~/.config/solana/idhydra.json -l debug

done 
