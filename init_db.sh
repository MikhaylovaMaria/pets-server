#!/bin/bash
export $(grep -v '^#' .env | xargs)

psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS postgis;"

