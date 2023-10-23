export interface File {
  pk: number;
  uuid: string;

  name: string; // foto_saya.jpg
  type: string; // jpg, png
  size: number; // 1024 x 1024 = ? bytes
}