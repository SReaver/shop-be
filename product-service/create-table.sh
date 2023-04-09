aws dynamodb create-table 
    --table-name products 
    --attribute-definitions 
           AttributeName=id,AttributeType=S 
           AttributeName=title,AttributeType=S 
           AttributeName=description,AttributeType=S 
           AttributeName=price,AttributeType=N 
    --key-schema 
           AttributeName=id,KeyType=HASH 
           AttributeName=title,KeyType=RANGE 
    --billing-mode PAY_PER_REQUEST