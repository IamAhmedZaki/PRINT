// src/controllers/upload.controller.js
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file.filename,
      path: req.file.path
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


