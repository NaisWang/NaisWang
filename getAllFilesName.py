# coding = utf-8
import os
import json


def read_directory(path, result):
  paths = os.listdir(path)
  for i, item in enumerate(paths):
    sub_path = os.path.join(path, item)
    if item.endswith('.swp') or item.endswith('.gitignore') or item.endswith('.git') or item.endswith('.vscode') or item.endswith('.DS_Store'):
      continue
    if os.path.isdir(sub_path):
      result[item] = {}
      read_directory(sub_path, result[item], )
    else:
      result[item] = item


def generateAllFileTxt(allFileTxt):
  g = os.walk("./notes")
  for path, dir_list, file_list in g:

    for file_name in file_list:
      if os.path.splitext(file_name)[-1] == ".md":
        file_path = os.path.join(path, file_name)
        with open(file_path, 'r') as f:
          allFileTxt.append({
              "title": file_path,
              "body": f.read()
          })


if __name__ == '__main__':
  fpath = './notes'
  filename = './files.txt'
  result = {}
  read_directory(fpath, result)
  json_res = json.dumps(result, indent=2, ensure_ascii=False)
  with open(filename, 'w', encoding="utf-8") as fp:
    fp.write(json_res)

  allFileTxt = []
  generateAllFileTxt(allFileTxt)
  json_res = json.dumps(allFileTxt, indent=2, ensure_ascii=False)
  with open('allFileSearch.txt', 'w', encoding="utf-8") as fp:
    fp.write(json_res)
