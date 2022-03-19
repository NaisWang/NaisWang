import os
import json

g = os.walk("./notes")

result = []

for path, dir_list, file_list in g:
  for file_name in file_list:
    if os.path.splitext(file_name)[-1] == ".md":
      file_path = os.path.join(path, file_name)
      with open(file_path, 'r') as f:
        result.append({
            "title": file_path,
            "body": f.read()
        })

print(result)

json_res = json.dumps(result, indent=2, ensure_ascii=False)
with open('allFileSearch.txt', 'w', encoding="utf-8") as fp:
  fp.write(json_res)
