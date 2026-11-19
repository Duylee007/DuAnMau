@echo off
title Day code len GitHub (Duylee007)
echo ========================================================
echo         DANG DONG GOI VA DAY CODE LEN GITHUB
echo ========================================================
echo.
set PATH=C:\Program Files\Git\cmd;%PATH%
git -c safe.directory=* add .
git -c safe.directory=* commit -m "Update source code"
git -c safe.directory=* push origin main
git -c safe.directory=* push https://github.com/Duylee007/DuAnMau.git main:main --force
echo.
echo ========================================================
echo HOAN TAT! Code da duoc cap nhat len ca 2 repo GitHub!
echo ========================================================
pause
