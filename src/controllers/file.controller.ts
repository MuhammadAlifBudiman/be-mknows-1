import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Container } from "typedi";

import { FileService } from "@services/files.service";
import { RequestWithUser } from "@interfaces/authentication/token.interface";

import { apiResponse } from "@utils/apiResponse";
import { HttpException } from '@/exceptions/HttpException';
import path from "path";

export class FileController {
  private file = Container.get(FileService);

  public uploadFile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const image = req.file as Express.Multer.File;
    const user_id = req.user.pk as number;

    if(!image) throw new HttpException(false, 400, "File is required");

    const response = await this.file.uploadSingleFile(user_id, image);
    res.status(201).json(apiResponse(201, "OK", "Upload Success", response));
  });

  public getMyFiles = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const user_id = req.user.pk as number;
      const files = await this.file.getUserFiles(user_id);
      res.status(200).json(apiResponse(200, "OK", "User's Files", files));
    }
  );

  public previewFile = asyncHandler(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const user_id = req.user.pk as number;
      const file_id = req.params.file_id;

      const file = await this.file.getPreviewFile(user_id, file_id);
  
      if (!file) {
        throw new HttpException(false, 404, "File not found");
      }
  
      const previewURL = `http://localhost:3000/${file.name}`;
  
      res.status(200).json(apiResponse(200, "OK", "File Preview", { previewURL }));
    }
  );
}