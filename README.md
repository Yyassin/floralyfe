<span title="floralyfe logo">
 <p align="center">
  <img width="100px" src="./assets/logo.png" alt="illumi-img">
 </p>
</span>

<h1 align="center" style="margin-top: 0px;">floralyfe</h1>

> The repository for the development of floralyfe. Team: Abdalla, Yousef, Zakariyya

## SYSC3010 Project
Floralyfe is being built as a project submission for SYSC3010. The project comprises a distributed remote plant monitoring solution.

### Development

### pi
It is recommended that you setup a virtual environment to run the python instance. Follow the instructions below to do this.

Proceed to the `/pi` directory and execute the following commands depending on your operating system.

#### Windows
1. Initialize a virtual environment called `env` using `python3 -m venv env`.
2. Once the environment has been created, activate it using `.\env\Scripts\activate`.
3. Within the environment, run `pip install -r requirements.txt` to install dependencies.

#### Linux (Raspbian)
1. Scripts have already been provided for you to simplify the process.
2. Initialize the virtual environment by running `source venv.sh`.
3. Once initialized, a `env/` directory should have been created under `pi/`.
4. Install all dependencies using `source install.sh`.
5. If the virtual environment is already installed, run `source run.sh` to enter it. The command `source exit.sh` is used to exit the environment. **Note:** The location of both these files is under `pi/` and they must be referenced accordingly.

- Once the environment and dependencies have been setup. Navigate to `src/` and execute the entrypoint `python main.py` to run the pi instance. Refer to the notes below for additional development details.

#### Additional Notes
TODO: Add general architecture info

**Attention:** Standalone testing of modules ***must*** be performed from within `src/` such that
`src/` remains the root of the application and imports keep working. See `camera_standalone.py` and `irrigation_standalone.py` for examples.
Run `mypy --strict --implicit-reexport $(git ls-files '*.py')` before making any pull requests and ensure all tests pass.

1. Run `pytest -v` to execute unit tests.
2. Linting is performed with flake8 and mypy.
3. Anytime you install a module, run `pip freeze > requirements.txt` to save it. 
**Note**: Make sure to change the following package versions to avoid installation errors in the future:
```s
numpy==1.19.5
opencv-python==4.5.3.56
tomli>=1.0
websockets==9.1
Pillow==8.4.0
scipy==1.5.4
<Remove> pkg_resources==0.0.0
<Remove> picamera==1.13
```

#### Setting Up Linting (VSCode)
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
        "reportOptionalMemberAccess": "none"
},
"python.linting.flake8Args": [
    "--ignore", 
    "E501"
],
"python.linting.mypyEnabled": true,
"python.linting.flake8Enabled": true
```
Mypy will take care of most typing errors and pylint/pylance will still recognize general type issues
and will ignore most unknown types from non-typed modules.


### server

1. Run `npm i` to install all dependencies
2. Run `npm run test` or `npm test` to run unit tests.
3. Run `npm run dev` to start the server in development on port 4000.


### client
1. Run `npm i` to install all dependencies
3. Run `npm run dev` to start the client in development on port 3000.
