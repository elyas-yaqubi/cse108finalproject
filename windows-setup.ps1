# Run in root directory

# install react dependencies
Set-Location .\fits-app
npm install
Set-Location ..
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
npm install react-router-dom

# create virtual environment and enter it
python -m venv .venv
./.venv/Scripts/activate

# install requirements.txt
pip install -r requirements.txt