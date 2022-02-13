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

#### pi
1. On windows, run `./env/Scripts/activate` to open the virtual environment.
2. Inside, run `pip install -r requirements.txt` to install dependencies.
3. Run `pytest -v` to execute unit tests.
4. Linting is performed with flake8 and mypy.

#### server

1. Run `npm i` to install all dependencies
2. Run `npm run test` or `npm test` to run unit tests.
3. Run `npm run dev` to start the server in development.