#!/bin/bash

# Define the wallet address
WALLET_ADDRESS="FAEYozsZVkxhXwG1HnVJn58Ks3dff31zjtA8b3KezFJ6"

# Fetch transaction history for the wallet
transactions=$(solana transaction-history $WALLET_ADDRESS -v)

# Count total lines
total_lines=$(echo "$transactions" | wc -l)

# Initialize counter for reverse count
counter=$total_lines 

echo '['

# Process each line using a while loop
echo "$transactions" | while IFS= read -r line; do
    # Split the line into transaction ID and metadata using awk
    transaction_id=$(echo "$line" | awk -F ' \\[slot=' '{ print $1 }')
    metadata=$(echo "$line" | awk -F ' \\[slot=' '{ print "[slot=" $2 }')
    
    slot_inter=$(echo "$metadata" | awk -F ' ' '{ print substr($0, 2) }' | awk '{print $1}')
    slot=$(echo "$slot_inter" | awk -F '=' '{ print $1 ":"; print $2}')

    timestamp_inter=$(echo "$metadata" | awk -F ' ' '{ print substr($0, 2) }' | awk '{print $2}')
    timestamp=$(echo "$timestamp_inter" | awk -F '=' '{ print $1 ":"; print $2}')
    
    finalized_inter=$(echo "$metadata" | awk -F ' ' '{ print substr($0, 2) }' | awk '{print $3}')
    finalized=$(echo "$finalized_inter" | awk -F '=' '{ print $1 ":"; print $2}')

    # Echo or print the transaction details with reverse count
    echo ' {'
    echo '  "transaction": ' $counter ','
    echo '  "transaction_id": "'$transaction_id '",'
    echo '  "Metadata": {'$slot ',' $timestamp ',' $finalized '},'
    echo '  "url": "https://solana.fm/tx/'$transaction_id'?cluster=mainnet-alpha"'
    echo ' },' 

    # Decrease counter for reverse count
    ((counter--))
done

echo ']'
