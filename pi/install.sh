#!/bin/bash

pip install --upgrade pip
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
pip install pkg_resources picamera
sudo apt-get install -y libatlas-base-dev       # PortAudio for tkgpio (not for SSH)
pip install -U numpy
pip install opencv-python==4.5.3.56
