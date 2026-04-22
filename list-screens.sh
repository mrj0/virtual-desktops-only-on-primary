#/bin/bash
script="`dirname ~/.local/share/kwin/scripts/virtual-desktops-only-on-primary/metadata.json`/contents/code/list-screens.js"

num=`qdbus6 org.kde.KWin /Scripting org.kde.kwin.Scripting.loadScript $script`

qdbus6 org.kde.KWin /Scripting/Script$num org.kde.kwin.Script.run

journalctl QT_CATEGORY=js QT_CATEGORY=kwin_scripting -n 5 --no-pager

qdbus6 org.kde.KWin /Scripting/Script$num org.kde.kwin.Script.stop
