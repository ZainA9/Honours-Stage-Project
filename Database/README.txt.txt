events.json - Contains exported event data from your MongoDB database. Each entry includes fields like title, date, category, and RSVP details.

users.json - Contains sample user accounts used to log in or create events in the system.

These can be imported into MongoDB using:
mongoimport --db EventFinderDB --collection Events --file events.json
mongoimport --db EventFinderDB --collection Users --file users.json
