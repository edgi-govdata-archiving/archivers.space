
# Export collection
# mongoexport -h [host-name] --port [port] -u [user] -p [pass] -d [database] -c [collection] -o data/mongo_export.json --jsonArray

#export from local db
mongoexport --port 3001 -d meteor -c urls -o data/mongo_export.json --jsonArray

node transform_export data/mongo_export.json data/export.json

node make_google_sheet data/export.json
