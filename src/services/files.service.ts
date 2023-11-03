import { Service } from "typedi";
import { DB } from "@database";

import { File } from "@interfaces/file.interface";

@Service()
export class FileService {
  public async uploadSingleFile(user_id: number, file: Express.Multer.File): Promise<File> {
    const fileUpload = await DB.Files.create({
      user_id,
      name: file.filename,
      type: file.mimetype,
      size: file.size
    });

    return fileUpload;
  };

  public async getUserFiles(user_id: number): Promise<File[]> {
    const userFiles = await DB.Files.findAll({ where: { user_id } });
    return userFiles;
  }

  public async getPreviewFile(user_id: number, file_id: string): Promise<File | null> {
    const file = await DB.Files.findOne({ where: { pk: file_id, user_id } });
    return file;
  }
};