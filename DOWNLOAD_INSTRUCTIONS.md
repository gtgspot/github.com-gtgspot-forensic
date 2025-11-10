# 📥 Download Instructions

## ⚠️ Important: Folder Download Issue

The `.app` folder cannot be downloaded directly through the "Download All" button due to how the interface handles directories.

---

## ✅ SOLUTION: Download the Complete Archive

### Option 1: Single Complete Archive (Recommended)

**Download this file:**
- **ForensicLegalAnalyzer-Complete.tar.gz** (30KB)

This contains:
- ✅ The complete .app bundle
- ✅ All documentation files
- ✅ Fix permissions script
- ✅ Everything you need

**To extract:**
```bash
tar -xzf ForensicLegalAnalyzer-Complete.tar.gz
```

---

### Option 2: Download Individual Files

Download these files separately:

1. **ForensicLegalAnalyzer-macOS.tar.gz** (18KB) - The app bundle compressed
2. **START_HERE.md** - Quick setup guide
3. **PERMISSION_FIX_GUIDE.md** - Troubleshooting
4. **fix-permissions.sh** - Permission fix script

**To extract the app:**
```bash
tar -xzf ForensicLegalAnalyzer-macOS.tar.gz
```

---

## 🚀 After Downloading

### Step 1: Extract the Archive

Double-click the `.tar.gz` file in Finder, or use Terminal:

```bash
cd ~/Downloads
tar -xzf ForensicLegalAnalyzer-Complete.tar.gz
```

### Step 2: Fix Permissions (Required!)

**Option A - Use the script:**
```bash
cd ~/Downloads
chmod +x fix-permissions.sh
./fix-permissions.sh
```

**Option B - Manual command:**
```bash
cd ~/Downloads
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
```

### Step 3: Launch

**Double-click** `ForensicLegalAnalyzer.app`

If security warning appears:
- Right-click → Open
- Click "Open"

### Step 4: Use!

Browser opens automatically to the forensic analyzer interface.

---

## 🎯 Complete One-Line Setup

After downloading and extracting, run this in Terminal:

```bash
cd ~/Downloads && chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer && open ForensicLegalAnalyzer.app
```

---

## 📦 What Each Archive Contains

### ForensicLegalAnalyzer-Complete.tar.gz (30KB)
- ForensicLegalAnalyzer.app/ (complete application)
- START_HERE.md
- PERMISSION_FIX_GUIDE.md  
- PACKAGE_SUMMARY.md
- DISTRIBUTION_README.md
- DEPLOYMENT_CHECKLIST.md
- fix-permissions.sh

### ForensicLegalAnalyzer-macOS.tar.gz (18KB)
- ForensicLegalAnalyzer.app/ (complete application only)

---

## 🔧 Alternative: Create Standalone HTML File

If you prefer not to use the .app bundle, you can also extract just the HTML file:

1. Extract the archive
2. Navigate to: `ForensicLegalAnalyzer.app/Contents/Resources/`
3. Open `index.html` directly in your browser
4. Works the same way but without the launcher

**To use standalone HTML:**
```bash
# Extract
tar -xzf ForensicLegalAnalyzer-Complete.tar.gz

# Navigate to Resources
cd ForensicLegalAnalyzer.app/Contents/Resources/

# Open in browser
open index.html
```

The HTML file is completely self-contained and works independently.

---

## 📱 Sharing with Others

When sharing with colleagues or clients:

**Best method:**
- Share `ForensicLegalAnalyzer-Complete.tar.gz`
- Include `START_HERE.md` 
- Tell them to run the chmod command after extracting

**Alternative:**
- Extract the .app folder
- Zip it using Finder (right-click → Compress)
- Share the resulting .zip file
- Permissions will be preserved in macOS .zip files

---

## 💡 Pro Tip: Create a Disk Image

For the best distribution experience on macOS:

```bash
# After extracting and fixing permissions
hdiutil create -volname "Forensic Legal Analyzer" \
  -srcfolder ForensicLegalAnalyzer.app \
  -ov -format UDZO \
  ForensicLegalAnalyzer.dmg
```

This creates a `.dmg` file that:
- Preserves all permissions
- Provides a professional installation experience
- Users just drag to Applications folder

---

## ✅ Verification

After setup, verify everything works:

```bash
# Check permissions
ls -l ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer

# Should show: -rwxr-xr-x (note the 'x' for executable)

# Test launch
open ForensicLegalAnalyzer.app
```

---

## 🆘 Still Having Issues?

### Can't extract .tar.gz
**Solution:** macOS should handle this automatically. If not:
```bash
tar -xzf ForensicLegalAnalyzer-Complete.tar.gz
```

### Permission denied when running chmod
**Solution:** Add sudo:
```bash
sudo chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
```

### Want to use without the .app wrapper
**Solution:** Just open the HTML file directly:
```bash
open ForensicLegalAnalyzer.app/Contents/Resources/index.html
```

---

## 📋 Quick Reference

**Download:** ForensicLegalAnalyzer-Complete.tar.gz  
**Extract:** Double-click or `tar -xzf`  
**Fix:** `chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer`  
**Launch:** Double-click the .app  
**Alternative:** Open `index.html` directly in browser  

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ No permission errors
- ✅ Browser opens automatically (or you open index.html)
- ✅ You see the Forensic Legal Analyzer interface
- ✅ Two upload zones are visible
- ✅ You can upload and analyze documents

---

**Ready to download!** Get ForensicLegalAnalyzer-Complete.tar.gz and follow the steps above.
