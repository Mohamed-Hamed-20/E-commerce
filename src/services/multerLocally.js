import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('123456_=!ascbhdtel', 5)


export const multerFunction = (allowedExtensionsArr, customPath) => {

  if (!allowedExtensionsArr) {
    allowedExtensionsArr = allowedExtensions.Image
  }
  if (!customPath) {
    customPath = 'General'
  }

  const destPath = path.resolve(`uploads/${customPath}`)

  //================================== Custom Path =============================
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true })
  }

  //================================== Storage =============================
  const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, destPath)
    },
    //filename
    filename: function (req, file, cb) {
      const uniqueFileName = nanoid() + file.originalname
      cb(null, uniqueFileName)
    },
  })

  //================================== File Filter =============================
  const fileFilter = function (req, file, cb) {

    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true)
    }
    cb(new Error('invalid extension', { cause: 400 }), false)
  }

  const fileUpload = multer({
    fileFilter,
    storage
  })
  return fileUpload
}

