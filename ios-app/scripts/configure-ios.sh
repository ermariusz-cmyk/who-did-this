#!/usr/bin/env bash
# Applies the settings the generated Xcode project needs: icon, launch screen,
# portrait only, iPhone only, no-encryption flag. Safe to run after every sync.
set -euo pipefail
cd "$(dirname "$0")/.."
APP=ios/App/App
[ -d "$APP" ] || { echo "Run 'npm run ios:add' first"; exit 1; }
cp ../icon-1024.png "$APP/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png"
for f in splash-2732x2732.png splash-2732x2732-1.png splash-2732x2732-2.png; do
  cp resources/splash.png "$APP/Assets.xcassets/Splash.imageset/$f"
done
python3 - "$APP/Info.plist" <<'PY'
import plistlib, sys
p = sys.argv[1]
with open(p, 'rb') as f: d = plistlib.load(f)
d['UISupportedInterfaceOrientations'] = ['UIInterfaceOrientationPortrait']
d.pop('UISupportedInterfaceOrientations~ipad', None)
d['ITSAppUsesNonExemptEncryption'] = False
d['UIRequiresFullScreen'] = True
d['UIStatusBarHidden'] = True
d['UIViewControllerBasedStatusBarAppearance'] = False
with open(p, 'wb') as f: plistlib.dump(d, f)
PY
# iPhone only
sed -i.bak 's/TARGETED_DEVICE_FAMILY = "1,2";/TARGETED_DEVICE_FAMILY = 1;/g' ios/App/App.xcodeproj/project.pbxproj
rm -f ios/App/App.xcodeproj/project.pbxproj.bak
echo "iOS project configured"
