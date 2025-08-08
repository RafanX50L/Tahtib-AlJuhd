# Start Redis Server
Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "cd './Redis-Server'; ./redis-server.exe"

Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "cd..'; cd Backend"

# Start Backend
Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "cd './Backend'; npm run dev"

# Start Frontend
Start-Process -NoNewWindow powershell -ArgumentList "-NoExit", "cd './Frontend'; npm run dev"
cd .. # Go back to root
