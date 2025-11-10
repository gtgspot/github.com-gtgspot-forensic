# 🚀 START HERE - Quick Setup

## ⚡ Quick Fix (30 seconds)

Before using the app for the first time, run this in Terminal:

```bash
cd ~/Downloads
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
```

**That's it!** Now double-click the app to run it.

---

## 📖 Why This Step?

The app was created in a container environment, so macOS needs you to explicitly mark the executable as runnable. This is a one-time setup.

---

## 🎯 Full Setup Steps

### 1. Download the Files
- Download `ForensicLegalAnalyzer.app` (or extract from .tar.gz)
- Place in your Downloads folder or Applications

### 2. Fix Permissions (One Time Only)

**Open Terminal** and run:

```bash
# If in Downloads:
cd ~/Downloads
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer

# If in Applications:
cd /Applications  
chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer
```

### 3. Launch the App

**Double-click** `ForensicLegalAnalyzer.app`

If you see a security warning about "unidentified developer":
- Right-click the app → Open
- Click "Open" in the dialog
- (Only needed once)

### 4. Start Analyzing!

- Browser opens automatically
- Upload two documents
- Click "Commence Forensic Analysis"
- Review comprehensive results

---

## 🆘 Having Issues?

### "You do not have permission to open the application"
→ You need to run the chmod command above

### "Python 3 is required"  
→ Install Python 3 from python.org

### "Cannot be opened because it is from an unidentified developer"
→ Right-click → Open → Open

### Nothing happens
→ Manually open browser to `http://localhost:8765`

---

## 📚 Documentation

- **PERMISSION_FIX_GUIDE.md** - Detailed troubleshooting
- **PACKAGE_SUMMARY.md** - Complete feature overview  
- **DISTRIBUTION_README.md** - Sharing and distribution
- **Inside the .app:**
  - README.md - Full documentation
  - USER_GUIDE.md - Usage examples
  - INSTALL.txt - Quick reference

---

## ✨ What You Get

### Three-Phase Analysis System

**Phase A:** 8 interpretive frameworks analyze both documents
- Statutory procedural analysis
- Contextual analysis  
- Jurisprudential analysis
- Objective textual analysis
- And 4 more...

**Phase B:** Cross-reference analysis
- Identifies governing framework
- Detects discrepancies
- Flags omissions
- Assesses compliance

**Phase C:** Statutory interpretation
- Literal interpretation
- Contextual analysis
- Purposive interpretation
- Harmonious construction
- Interpretive principles

### Features

✓ Upload via file, drag-drop, or URL
✓ Supports .txt, .doc, .docx, .pdf
✓ Complete privacy (all local processing)
✓ Export reports as JSON
✓ Expandable result sections
✓ Severity-coded issues
✓ Strategic recommendations

---

## 🔒 Privacy

- All processing happens on YOUR Mac
- No external servers
- No data transmitted
- No tracking
- Completely private

---

## 💻 Requirements

- macOS 10.13 or later
- Python 3 (pre-installed on modern macOS)
- 4GB RAM
- Any modern browser

---

## 🎓 Perfect For

- Legal professionals analyzing disclosure
- Self-represented litigants
- Law students learning statutory interpretation
- Anyone comparing legal documents

---

## ⚡ Quick Command (Copy & Paste)

```bash
cd ~/Downloads && chmod +x ForensicLegalAnalyzer.app/Contents/MacOS/ForensicLegalAnalyzer && open ForensicLegalAnalyzer.app
```

This command:
1. Goes to Downloads
2. Fixes permissions
3. Launches the app

---

## ✅ Success!

Once permissions are fixed:
- App launches normally every time
- Browser opens automatically  
- Ready to analyze documents
- No further setup needed

---

**Questions?** Read PERMISSION_FIX_GUIDE.md for detailed troubleshooting.

**Ready to use!** Just run the chmod command and start analyzing.
