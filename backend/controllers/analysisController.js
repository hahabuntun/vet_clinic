const fs = require('fs');
const path = require('path');
const Analysis = require('../models/analysis.js');

const uploadAnalysis = async (req, res) => {
  try {
    const { name, animal_id, description } = req.body;
    const file = req.files.file;  // This will be available if we use express-fileupload
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    let filename = file.name;
    let filepath = path.join(uploadsDir, filename);

    let counter = 1;
    while (fs.existsSync(filepath)) {
      const ext = path.extname(filename);
      const baseName = path.basename(filename, ext);
      filename = `${baseName}(${counter})${ext}`;
      filepath = path.join(uploadsDir, filename);
      counter++;
    }

    file.mv(filepath, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file', error: err.message });
      }

      const analysis_date = new Date();
      const newAnalysis = new Analysis({
        name,
        filepath: `uploads/${filename}`,
        animal_id,
        analysis_date,
        description
      });

      await newAnalysis.save();
      res.status(200).json({ message: 'File uploaded successfully', data: newAnalysis });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
};

const downloadAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.download(path.join(__dirname, '..', analysis.filepath));
  } catch (err) {
    res.status(500).json({ message: 'Error downloading file', error: err.message });
  }
};

const getAnalysisByAnimal = async (req, res) => {
  try {
    const { animal_id } = req.params;
    const analyses = await Analysis.find({ animal_id });
    res.status(200).json(analyses);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving analyses', error: err.message });
  }
};

module.exports = { uploadAnalysis, downloadAnalysis, getAnalysisByAnimal };
