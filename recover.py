import json, glob, os

for f in glob.glob('C:/Users/shubh/.gemini/antigravity-ide/brain/*/.system_generated/logs/transcript_full.jsonl'):
    for line in open(f, 'r', encoding='utf-8'):
        try:
            data = json.loads(line)
        except:
            continue
        tcs = data.get('tool_calls', [])
        if not tcs:
            continue
        for tc in tcs:
            # handle both {"name": "...", "args": {...}} and {"function": {"name": "...", "arguments": "{...}"}}
            func = tc.get('function', tc)
            name = func.get('name')
            if name == 'default_api:write_to_file' or name == 'default_api:replace_file_content':
                args = tc.get('args', tc.get('arguments', func.get('arguments', {})))
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except:
                        pass
                
                if isinstance(args, dict):
                    target = args.get('TargetFile', '')
                    content = args.get('CodeContent', args.get('ReplacementContent', ''))
                    
                    if 'backend' in target and content:
                        print(f"Found {name} for {target}".encode('ascii', 'ignore').decode())
                        target = target.replace('\\', '/')
                        os.makedirs(os.path.dirname(target), exist_ok=True)
                        with open(target, 'w', encoding='utf-8') as out:
                            out.write(content)
