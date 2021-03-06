@ECHO off
IF NOT DEFINED IS_CHILD_PROCESS (CMD /K SET IS_CHILD_PROCESS=1 ^& %0 %*) & EXIT )
TITLE Bastion Bot
CLS
COLOR 0F
ECHO.

SET cwd=%~dp0
CD /D %cwd%

ECHO [Bastion]: Welcome, %USERNAME%!
ECHO.

ECHO [Bastion]: Updating Bastion Bot...
git pull origin stable 1>nul || (
  ECHO [Bastion]: Unable to update the bot.
  GOTO :EXIT
)
ECHO [Bastion]: Done.
ECHO.

ECHO [Bastion]: Updating dependencies...
choco upgrade ffmpeg -y
RD /S /Q node_modules 2>nul
DEL /Q package-lock.json 2>nul
CALL npm i --only=production --no-package-lock >nul 2>update.log
ECHO [Bastion]: Done.
ECHO [Bastion]: If you get any errors please check the update.log file for errors while updating.
ECHO [Bastion]: Ready to boot up and start running.
ECHO.

EXIT /B 0

:EXIT
ECHO.
ECHO [Bastion]: If you faced any issues during any steps, join my official server and our amazing support staffs will help you out.
ECHO [Bastion]: Stay updated about new releases, important announcements, a lot of other things and giveaways too!
ECHO [Bastion]: https://discord.gg/fzx8fkt
ECHO.
ECHO [Bastion]: Press any key to exit.
PAUSE >nul 2>&1
CD /D "%cwd%"
TITLE Windows Command Prompt (CMD)
COLOR
