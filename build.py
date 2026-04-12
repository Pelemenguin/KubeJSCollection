import os.path
import sys
import zipfile

file_name = sys.argv[1]

to_read = zipfile.ZipFile(file_name, 'r')
to_write = zipfile.ZipFile(file_name[:-4] + ".zip", 'w')

# Copy folder `contentpacks` from `to_read`
# to folder `kubejs` of `to_write`

for item in to_read.infolist():
    if item.filename.startswith("contentpacks/"):
        # Original file path: "contentpacks/xxx_scripts/xxx.js"
        # New file path:      "kubejs/xxx_scripts/<modid>/xxx.js"
        # to_read file name:  ".../<modid>-<version>.jar"
        if not item.filename.endswith((".js", ".d.ts")):
            continue
        modid = os.path.basename(file_name[:-4]).split("-")[0]
        l = item.filename.split("/")
        l.insert(2, modid)
        new_name = "kubejs/" + '/'.join(l[1:])
        to_write.writestr(new_name, to_read.read(item))
