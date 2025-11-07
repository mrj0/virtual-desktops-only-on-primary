# Virtual Desktops Only On Primary

This is a script that brings a feature similar to GNOME Mutter's `workspaces-only-on-primary` option, that is switchable virtual desktops on the primary monitor, and non-switchable virtual desktops on other monitors.

Functionality:

- All windows placed on monitors other than the primary, are automatically set to be shown on all virtual desktops.
- When window is moved to a primary screen, it will be assigned to a current virtual desktop.

This can be considered a hack, but from the user's perspective, this effectively results in having multiple switchable virtual desktops on the primary monitor, and fixed non-switchable virtual desktops on other monitors.
That's how GNOME Shell handles workspaces by default, and the script mimics that.

## INSTALLATION:

Manual installation can be done by copying the script to `~/.local/share/kwin/scripts/` or by running the command:

```bash
kpackagetool6 --type=KWin/Script -i `pwd`
```

Next, you'll need to configure the script in KWin settings. Open KDE System Settings, go to Window Management > KWin Scripts, and enable the script.

Click on the "Configure" button to open the configuration dialog. Here you can set the following options:

- **Primary Screen**: The name of the primary screen. By default, the script will use the configured primary monitor.

- **Number of screens**: The number of screens. Unless the number of configured screens are connected, the script will ignore window changes. This helps avoid changing windows as you connect or disconnect monitors. Change this to the number of monitors you have connected.

```js
for (let i = 0; i < workspace.screens.length; i++) {
  const screen = workspace.screens[i];
  console.log(
    `Screen #${i}: Name: ${screen.name}, Brand: ${screen.manufacturer}, Model: ${screen.model}`,
  );
}
```

The script will output the names of your monitors to the system log, which can be viewed with the command `journalctl --follow --user`

### Preview:

![VirtualBox_Neon_23_05_2024_18_31_01](https://github.com/Ubiquitine/virtual-desktops-only-on-primary/assets/3274951/64b30973-872f-47ec-a3fb-bcbb93f6ab49)

### Development

To update the script, first unload

```bash
qdbus6 org.kde.KWin /Scripting unloadScript virtual-desktops-only-on-primary
```

Install the script again, you may need to remove the script from the "KWIN scripts" settings panel before install will work.

```bash
kpackagetool6 --type=KWin/Script -i `pwd`
qdbus6 org.kde.KWin /Scripting start
```

See: https://discuss.kde.org/t/how-to-properly-reload-a-kwin-script/4260
