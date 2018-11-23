// load csv file to create ranks
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseRanks.csv' AS row
MERGE (rank:Rank {id: row.`Rank Reference`})
ON CREATE SET rank.id = toFloat(row.`Rank Reference`),
              rank.nameShort = row.`Rank Name - Short`,
              rank.nameLong = row.`Rank Name - Long`


// load csv file to create create techniques and connect to rank
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseStrikes.csv' AS row
//MATCH (rank:Rank {nameShort: row.Rank})
//MERGE (strike:Strike {name: row.Name})-[:REQUIRED_FOR]->(rank)
MERGE (strike:Strike {name: row.Name})
ON CREATE SET strike.name = row.Name

// connect descriptions to strikes
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseStrikes.csv' AS row
MATCH (strike:Strike {name: row.Name})
MERGE (strike)<-[:STEP_FOR]-(stepDescription:StepDescription {text: row.`Step Description`, number: row.`Step #`})
ON CREATE SET stepDescription.text = row.`Step Description`,
              stepDescription.number = row.`Step #`


// load csv file to create create techniques and connect to rank
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseBlocks.csv' AS row
//MATCH (rank:Rank {nameShort: row.Rank})
//MERGE (block:Block {name: row.Name})-[:REQUIRED_FOR]->(rank)
MERGE (block:Block {name: row.Name})
ON CREATE SET block.name = row.Name

// connect descriptions to blocks
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseBlocks.csv' AS row
MATCH (block:Block {name: row.Name})
MERGE (block)<-[:STEP_FOR]-(stepDescription:StepDescription {text: row.`Step Description`, number: row.`Step #`})
ON CREATE SET stepDescription.text = row.`Step Description`,
              stepDescription.number = row.`Step #`


// load csv file to create create techniques and connect to rank
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseKicks.csv' AS row
//MATCH (rank:Rank {nameShort: row.Rank})
//MERGE (kick:Kick {name: row.Name})-[:REQUIRED_FOR]->(rank)
MERGE (kick:Kick {name: row.Name})
ON CREATE SET kick.name = row.Name

// connect descriptions to kicks
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseKicks.csv' AS row
MATCH (kick:Kick {name: row.Name})
MERGE (kick)<-[:STEP_FOR]-(stepDescription:StepDescription {text: row.`Step Description`, number: row.`Step #`})
ON CREATE SET stepDescription.text = row.`Step Description`,
              stepDescription.number = row.`Step #`


// connect technique to Rank
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseAllTechniques.csv' AS row
MATCH (rank:Rank {nameShort: row.Rank})
MATCH (technique {name: row.Name})
MERGE (rank)<-[:REQUIRED_FOR]-(technique)


// Query to count all [:REQUIRED_FOR] techniques connected to particular rank
MATCH (rank:Rank)
OPTIONAL MATCH (rank)<-[:REQUIRED_FOR]-(strike:Strike)
OPTIONAL MATCH (rank)<-[:REQUIRED_FOR]-(block:Block)
OPTIONAL MATCH (rank)<-[:REQUIRED_FOR]-(kick:Kick)
RETURN rank.id, 
     rank.nameLong, 
       count(strike) AS StrikeCount, 
       count(block) AS BlockCount, 
       count(kick) AS KickCount, 
       count(strike)+count(block)+count(kick) AS TechniqueCount
ORDER BY rank.id