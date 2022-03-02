# Setting Up Linting (VSCode)
1. The `.vscode` configuration has already been provided.
2. Simply download the following packages: `pip install mypy flake8 pylint`
3. In VSCode, download the "Pylance" and "Python" Extensions.
4. Open "Settings" from the cog in the bottom left corner and enter "Linting" in the search bar.
5. Scroll down and check the following:
    - **Python > Linting:** Flake8 Enabled
    - **Python > Linting:** Mypy Enabled
6. Some modules do not have typing support. To avoid linting issues, add the following to your global `settings.json`:
```json
    "python.analysis.typeCheckingMode": "strict",
    "python.analysis.diagnosticSeverityOverrides": {
        "reportUnknownMemberType": "none",
        "reportUnknownLambdaType": "none",
        "reportUnknownParameterType": "none",
        "reportUnknownArgumentType": "none",
        "reportOptionalMemberAccess": "none",
        "reportUnknownVariableType": "none",
        "reportMissingTypeStubs": "none",
        "reportMissingImports": "none",
        "reportMissingModuleSource": "none"
    },
    "python.linting.mypyEnabled": true,
    "python.linting.mypyArgs": [
        "--ignore-missing-imports",
        "--follow-imports=silent",
        "--show-column-numbers",
        "--disallow-untyped-defs",
        "--disallow-untyped-calls"
    ],
    "python.linting.flake8Enabled": true,
    "python.linting.flake8Args": [
        "--ignore", 
        "E501"
    ],
    "mypy.configFile": "./pi/mypy.ini"
```
The configuation above allows pylint/pylance to ignore most unknown types from non-typed modules. Mypy will take care of most typing errors and pylint/pylance will still recognize general type issues.