/*
    Sharpで画像をwebpに最適化します
    <Image />以外で使われている画像が対象です
    ターミナルで以下のコマンドを叩きます（横幅と画質はオプションです）
    node sharpen.js src/assets/img/[ファイル名] [横幅(デフオルト1920)] [画質(デフォルト90)]
    同じフォルダに同じファイル名で拡張子が.webpのファイルが作成されます
*/

/* eslint-disable no-undef */
import sharp from 'sharp';
import { join, dirname, basename, extname } from 'path';

const filename = process.argv[2];

if (!filename) {
    console.error('Please provide a filename as an argument.');
    process.exit(1);
}

const outputFilename = join(
    dirname(filename),
    basename(filename, extname(filename)) + '.webp',
);

sharp(filename)
    .resize({ width: Number(process.argv[3]) || 1920 })
    .webp({ quality: Number(process.argv[4]) || 90 })
    .toFile(outputFilename)
    .then(() => {
        console.log('Image processed successfully.');
    })
    .catch((error) => {
        console.error('Error processing image:', error);
    });
