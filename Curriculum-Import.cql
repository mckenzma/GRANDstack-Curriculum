// load csv file to create ranks
LOAD CSV WITH HEADERS FROM 'file:///CurriculumDatabaseRanks.csv' AS row
MERGE (rank:Rank {id: row.`Rank Reference`})
ON CREATE SET rank.id = toFloat(row.`Rank Reference`),
              rank.nameShort = row.`Rank Name - Short`,
              rank.nameLong = row.`Rank Name - Long`