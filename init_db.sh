import dotenv from "dotenv";
dotenv.config();
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS postgis;"