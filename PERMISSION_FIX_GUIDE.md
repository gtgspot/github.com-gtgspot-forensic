# 🔧 Permission Fix Guide

## Problem: "You do not have permission to open the application"

This happens because the executable file inside the .app bundle doesn't have execute permissions set. This is a limitation of how the files were created in the container environment.

---

## ✅ SOLUTION - Choose One Method

### Method 1: Use Terminal (Easiest)

1. **Open Terminal** (Applications → Utilities → Terminal)

2. **Navigate to where you downloaded the app:**
   ```bash
   cd ~/Downloads
   # Or if it's in Applications:
   # cd /Applications
   ```

3. **Run this single command:**
   ```bash
   chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
   ```

4. **Verify it worked:**
   ```bash
   ls -l ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
   ```
   You should see `-rwxr-xr-x` at the beginning of the line (note the 'x' characters)

5. **Now try launching the app again** - it should work!

---

### Method 2: Use the Fix Script

1. **Download the fix-permissions.sh script** (in same folder as .app)

2. **Open Terminal**

3. **Navigate to the folder:**
   ```bash
   cd ~/Downloads
   ```

4. **Run the script:**
   ```bash
   ./fix-permissions.sh
   ```

5. **Launch the app** - it should work now!

---

### Method 3: Use Finder + Terminal (Visual)

1. **Open Finder** and navigate to the .app location

2. **Right-click** the `ForensicLegalAnalyzer.app` folder

3. **Select "Show Package Contents"**

4. **Navigate to:** Contents → MacOS

5. **You'll see the file:** `ForensicLegalAnalyzer`

6. **Open Terminal** and type this (don't press Enter yet):
   ```bash
   chmod +x 
   ```
   (note the space after +x)

7. **Drag the ForensicLegalAnalyzer file** from Finder into Terminal

8. **Press Enter**

9. **Close Finder and try launching the app** - it should work!

---

## 🔍 Why This Happened

When creating .app bundles programmatically in certain environments (like Docker containers), file permissions don't always transfer correctly to macOS. The executable inside the bundle needs the "execute" permission bit set.

---

## ✅ Verification Commands

After applying the fix, verify it worked:

```bash
# Check the executable
ls -l ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer

# Should show something like:
# -rwxr-xr-x ... ForensicLegalAnalyzer
#  ^^^ 
# These 'x' marks mean executable
```

---

## 🚀 After Fixing Permissions

Once permissions are fixed:

1. **Double-click** `ForensicLegalAnalyzer.app`

2. **If you see another security warning** about "unidentified developer":
   - Right-click the app
   - Select "Open"
   - Click "Open" in the dialog
   - This only needs to be done once

3. **Browser should open** to `http://localhost:8765`

4. **Start analyzing documents!**

---

## 🆘 Still Having Issues?

### Issue: "Python 3 is required"
**Solution:** Install Python 3 from python.org or:
```bash
brew install python3
```

### Issue: "Port 8765 already in use"
**Solution:** 
```bash
# Find what's using the port
lsof -i :8765

# Kill it if safe
kill -9 [PID from above]
```

### Issue: Nothing happens when double-clicking
**Solution:**
```bash
# Try launching from Terminal to see error messages
open ForensicLegalAnalyzer.app
```

### Issue: Permission denied in Terminal
**Solution:** Add sudo before the command:
```bash
sudo chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
```
(You'll be asked for your password)

---

## 📋 Complete Command Reference

```bash
# Navigate to Downloads
cd ~/Downloads

# Fix permissions
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer

# Verify permissions
ls -l ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer

# Launch from Terminal (to see any errors)
open ForensicLegalAnalyzer.app

# Or launch directly
./ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
```

---

## 🎯 Quick Fix - Copy and Paste This

Open Terminal and paste this entire block:

```bash
cd ~/Downloads
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
open ForensicLegalAnalyzer.app
```

If the app is in Applications folder instead:

```bash
cd /Applications
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
open ForensicLegalAnalyzer.app
```

---

## ✨ Alternative: Extract and Run Manually

If you're still having trouble, you can run the app manually:

1. **Open Terminal**

2. **Navigate to the app:**
   ```bash
   cd ~/Downloads/ForensicLegalAnalyzer.app/Contents/Resources
   ```

3. **Start the server:**
   ```bash
   python3 -m http.server 8765
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:8765
   ```

5. **Use the application!**

---

## 📝 For Distribution

When sharing this app with others, include these instructions:

**Option 1:** Fix permissions first
```bash
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
tar -czf ForensicLegalAnalyzer-macOS-fixed.tar.gz ForensicLegalAnalyzer.app
```

**Option 2:** Include fix-permissions.sh script and tell users to run it first

**Option 3:** Tell recipients to run this command after downloading:
```bash
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
```

---

## 💡 Pro Tip: Create a Disk Image (.dmg)

For easier distribution without permission issues:

```bash
# Create a DMG
hdiutil create -volname "Forensic Legal Analyzer" -srcfolder ForensicLegalAnalyzer.app -ov -format UDZO ForensicLegalAnalyzer.dmg

# This creates a disk image that preserves permissions better
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ App launches without permission error
- ✅ Terminal window appears briefly or stays open
- ✅ Browser opens automatically
- ✅ You see the Forensic Legal Analyzer interface
- ✅ Two upload zones are visible

---

## 🎉 Once It's Working

After the permission fix:
1. The app will work normally every time
2. You can move it to Applications folder
3. You can create shortcuts or add to Dock
4. Permissions will persist

---

**The permission issue is a one-time setup step. Once fixed, the app works perfectly!**
