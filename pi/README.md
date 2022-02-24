# pi

## Demo Instructions (for me)

1. Run venv.sh
2. Run install.sh
3. Start the server `npm run dev`
4. Start ngrok on http 4000 and put that url in main.py
5. Navigate to src, run `python main.py`
6. Send this message from the test extension:
```json
{
    "topic": "irrigation-topic",
    "userID": "hello",
    "payload": {"encoded": 29}
}
```

TODO: move the scripts to a scripts/ folder and call with source scripts/script_name.sh