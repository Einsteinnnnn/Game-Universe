import os
import sys

env = sys.argv[1]

file = open("src/config.js", "r")
lines = file.readlines()
file.close()
old_line = lines[0]
lines[0] = "export const env = '{}';\n".format(env)
file = open("src/config.js", "w")
file.writelines(lines)
file.close()

os.system(r"npm run build")
if env == "prod":
    os.system(r"rd /s/q ..\backend\static_prod")
    os.system(r"move build ../backend/static_prod")
else:
    os.system(r"rd /s/q ..\backend\static")
    os.system(r"move build ../backend/static")

lines[0] = old_line
file = open("src/config.js", "w")
file.writelines(lines)
file.close()