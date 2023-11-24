import os

file = open("src/config.js", "r")
lines = file.readlines()
file.close()
old_line = lines[0]
lines[0] = "export const env = 'prod';\n"
file = open("src/config.js", "w")
file.writelines(lines)
file.close()

os.system(r"rd /s/q ..\backend\static")
os.system(r"npm run build")
os.system(r"move build ../backend/static")

lines[0] = old_line
file = open("src/config.js", "w")
file.writelines(lines)
file.close()