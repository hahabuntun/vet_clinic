const fs = require('fs');
const path = require('path');
const {add_analysis_s, get_analysis_by_id_s, get_analyses_by_animal_id_s} = require("../services/analysisService.js")

const uploadAnalysis = async (req, res) => {
  try {
    const { name, animal_id, description } = req.body;
    const file = req.files.file;  // This will be доступно, если мы используем express-fileupload
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    
    // Создаем директорию, если она не существует
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    let filename = file.name;
    let filepath = path.join(uploadsDir, filename);
    let counter = 1;

    // Определяем путь для загрузки
    var upload_path = `uploads/${filename}`;

    // Проверяем, существует ли файл, и изменяем имя, если необходимо
    while (fs.existsSync(filepath)) {
      const ext = path.extname(filename);
      const baseName = path.basename(filename, ext);
      filename = `${baseName}(${counter})${ext}`;
      filepath = path.join(uploadsDir, filename);
      upload_path = `uploads/${filename}`; // Обновляем путь для загрузки
      counter++;
    }

    // Перемещаем файл в нужное место
    file.mv(filepath, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading file', error: err.message });
      }
      // Сохраняем анализ в базе данных
      const newAnalysis = await add_analysis_s(name, upload_path, animal_id, description);
      res.status(200).json({ message: 'File uploaded successfully', data: newAnalysis });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
};
const downloadAnalysis = async (req, res) => {
  try {
    const analysis = await get_analysis_by_id_s(req.params.id);
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
    const analyses = await get_analyses_by_animal_id_s(animal_id);
    res.status(200).json(analyses);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving analyses', error: err.message });
  }
};
module.exports = { uploadAnalysis, downloadAnalysis, getAnalysisByAnimal };
