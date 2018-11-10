// load csv file to create ranks
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseRanks.csv' AS row
MERGE (rank:Rank {id: row.`Rank Reference`})
ON CREATE SET rank.id = toFloat(row.`Rank Reference`),
              rank.nameShort = row.`Rank Name - Short`,
              rank.nameLong = row.`Rank Name - Long`

// load csv file to create create techniques and connect to rank
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseStrikes.csv' AS row
MERGE (strike:Strike {name: row.Name})
ON CREATE SET strike.name = row.Name

// connect descriptions to strikes
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseStrikes.csv' AS row
MATCH (strike:Strike {name: row.Name})
MERGE (strike)<-[:STEP_FOR]-(stepDescription:StepDescription {text: row.`Step Description`, number: row.`Step #`})
ON CREATE SET stepDescription.text = row.`Step Description`,
              stepDescription.number = row.`Step #`