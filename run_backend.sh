#!/bin/bash

cd backend
python3 -m uvicorn main:app --reload --port 8000
