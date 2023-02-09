import File from '../models/file';
import l from '../../config/logger';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    res.json(file);
  }
}

export default new FileController();
