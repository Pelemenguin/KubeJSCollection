import os
import os.path
import sys
import zipfile

script_name = sys.argv[1] # Just let it throw if argv is empty

# Try find ./kubejs/xxx_scripts/<script_name>/<script_name>.js (Could be multiple)
# xxx could be `startup`, `server` or `client`

def find_script_path(script_name):
    results: dict[str, str] = {}
    for xxx in ['startup', 'server', 'client']:
        script_path = os.path.join('kubejs', f'{xxx}_scripts', script_name, f'{script_name}.js')
        if os.path.exists(script_path):
            results[xxx] = script_path
    return results

scripts = find_script_path(script_name)

# Then find corresponding .d.ts files
# It could be <script_name>.d.ts (default) or <script_name>.zh_cn.d.ts (or other language)
# We only need to find the first file found for each language

# .d.ts files are under the same folder of .js files

def find_dts_path(script_name: str, scripts: dict[str, str]):
    results = {} # <language>: <file_path>, and default is considered "en_us"
    for xxx, script_path in scripts.items():
        script_folder = os.path.dirname(script_path)
        for file in os.listdir(script_folder):
            if file.startswith(script_name) and file.endswith('.d.ts'):
                language = 'en_us' # default
                if file.count('.') >= 3: # <script_name>.<language>.d.ts
                    language = file.split('.')[1]
                if language not in results:
                    results[language] = os.path.join(script_folder, file)
    return results

definitions = find_dts_path(script_name, scripts)

# Build multiple zips
# <script_name>.<language>.zip
# In each zip:
# - <script_name>.xxx.js where xxx is `startup`, `server` or `client
# - <script_name>.d.ts (throw away languange code as we will pack them into different zips)

if not os.path.exists('build'):
    os.mkdir('build')

for language, dts_path in definitions.items():
    zip_name = f'build/{script_name}.{language}.zip'
    with zipfile.ZipFile(zip_name, 'w') as zip_file:
        dts_name = f'{script_name}.d.ts'
        zip_file.write(dts_path, dts_name)
        placed_scripts = []
        for xxx, script_path in scripts.items():
            js_name = f'{script_name}.{xxx}.js'
            zip_file.write(script_path, js_name)
            placed_scripts.append(js_name)
        print("Created: " + zip_name)
        # Write ReadmeForUsers.<language>.md as README.md

        # Original text: (English)

        # # How to use?
        #
        # Create a folder in each of {script_types},
        # Place:
        #
        # {scripts}
        #
        # And place {definition} together with {startup_script}.

        # So we should format

        readme_name = f'ReadmeForUsers.{language}.md'
        if os.path.exists(readme_name):
            with open(readme_name, 'r', encoding='utf-8') as f:
                readme_content = f.read()
            readme_content = readme_content.replace('{script_types}', '[' + ', '.join(xxx + '_scripts' for xxx in scripts.keys()) + ']')
            readme_content = readme_content.replace('{scripts}', '\n'.join([f'- `{script_path}`' for script_path in placed_scripts]))
            readme_content = readme_content.replace('{definition}', f'`{dts_name}`')
            readme_content = readme_content.replace('{startup_script}', f'`{script_name}.{xxx}.js`' if 'startup' in scripts else 'the startup script')
            zip_file.writestr('README.md', readme_content)
