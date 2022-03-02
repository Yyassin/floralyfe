<span title="floralyfe logo">
 <p align="center">
  <img width="100px" src="./assets/logo.png" alt="illumi-img">
 </p>
</span>

<h1 align="center" style="margin-top: 0px;">floralyfe</h1>

[![pi](https://github.com/AbdallaAbdelhadi/SYSC3010W22_L3_G5/actions/workflows/pi.yml/badge.svg)](https://github.com/AbdallaAbdelhadi/SYSC3010W22_L3_G5/actions?query=workflow%3Api+tests)
[![node](https://github.com/AbdallaAbdelhadi/SYSC3010W22_L3_G5/actions/workflows/node.yml/badge.svg)](https://github.com/AbdallaAbdelhadi/SYSC3010W22_L3_G5/actions?query=workflow%3Anode+tests)

> A dsitributed remote plant monitoring and irrigation system. 

> Created By: Abdalla, Yousef, Zakariyya

## SYSC3010 Project
Floralyfe is being built as a project submission for SYSC3010. The project comprises a distributed remote plant monitoring solution that is composed of three core components: a frontend React client, a backend Node server and distributed Raspberry Pi systems

## Development
At a high level, the Floralyfe system consists of three core nodes: the client, the server and the pi system. The server serves as the communication layer, routing requests between the physical plant systems and the client. It also abstracts the cloud database. The client serves as the user's interface to the system while the pi system serves as the actual plant monitor and irrigation solution. To get these nodes running, follow the instructions below.

### pi
The Raspberry Pi node is written in Python. It is recommended that you setup a `virtual environment` to run the python instance along with its dependencies. Follow the instructions below to set up a local environment.

Proceed to the `/pi` directory and execute the following commands depending on your operating system.

1. Ensure that the python `venv` module is installed on your machine by using `pip install venv`.
#### Windows
1. Initialize a virtual environment called `env` using `python3 -m venv env`. Alternatively, `.\venv.bat` will do this for you.
2. Once the environment has been created, you should see a `env` directory created under the `pi/` root. To enter the virtual environment, activate it using `.\env\Scripts\activate`.
3. Within the environment, run `pip install -r requirements.txt` to install dependencies. Alternatively, `.\install.bat` will do the same thing.
4. To exit the virtual environment, run `deactivate`.

**Note**: Scripts for mounting/demouting the virtual environment could not be created without provided absolute paths to the activate and deactivate scripts.

#### Linux (Raspbian)
1. Scripts have already been provided for you to simplify the process. Feel free to open them to see the commands being executed.
2. Initialize the virtual environment by running `source venv.sh`.
3. Once initialized, an `env/` directory should have been created under `pi/`.
4. Ensure you've entered the environment (there will be a (env) prefix before your working directory). If you're not in the director, see step 5. Install all dependencies using `source install.sh`.
5. If the virtual environment is already installed, run `source run.sh` to enter it. The command `source exit.sh` is used to exit the environment. 

**Note:** The location of all script files is under `pi/` and they must be referenced accordingly.

Once the environment and dependencies have been setup. Navigate to `src/` and execute the entrypoint `python main.py` to run the pi instance. Refer to the notes below for additional development details.

#### Additional Notes
- The pi node implements a unit test workflow, to help develop code that passes these tests, follow [these instructions](https://github.com/AbdallaAbdelhadi/SYSC3010W22_L3_G5/blob/main/pi/Linting.md) to setup linting for VSCode.
- Tests can be executed using the `test.sh` or `test.bat` scripts. Alternatively, use the `pytest -v test/` command in `src`. *All unit tests should be added to the `test/` directory with a `test_` prefix.

- **Attention:** Standalone testing of modules ***must*** be performed from within `src/` such that
`src/` remains the root of the application and imports keep working. See `camera_standalone.py` and `irrigation_standalone.py` for examples.
- Run `mypy --strict --implicit-reexport $(git ls-files '*.py')` before making any pull requests and ensure all tests pass.
- Anytime you install a module, run `pip freeze > requirements.txt` to save it. 
- **Note**: Make sure to change the following package versions to avoid installation errors in the future:
    ```s
    numpy==1.19.5
    opencv-python==4.5.3.56
    tomli>=1.0
    websockets==9.1
    Pillow==8.4.0
    scipy==1.5.4
    pkg_resources==0.0.0        # remove this
    picamera==1.13              # remove this
    ```

### server
The server node is written in TypeScript and manages communication accross application nodes. The node exposes a GraphQL API to encapsulate the database layer and also exposes an explicit WebSocket Server. The dedicated WebSocket has been setup for client <-> system messaging in addition to pubsub based WebSockets abstracted by GraphQL subscriptions. 

1. Run `npm i` to install all dependencies
2. Run `npm run emulator-test` to run unit tests (that require a Firestore emulator).
3. Run `npm run dev` to start the server in development on port 5000.


### client
The client is based on Next and is used as the user's primary interface to the system. It is subscribed to messages sent to the logged in user at the WebSocket and GraphQL subscription channels and can also send messages through the WS connection.

1. Run `npm i` to install all dependencies
3. Run `npm run dev` to start the client in development on port 3000.


#### Additional Documentation
[OpenCV Luminescense Calculation](https://github.com/AbdallaAbdelhadi/SYSC3010W22_L3_G5/blob/main/pi/src/camera_system/luminescense.md)