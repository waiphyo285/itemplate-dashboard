const fs = require('fs')
const path = require('path')
const multer = require('multer')
const helpers = require('./helpers')
const config = require('@config/index')
const { createResponse } = require('@helpers/handlers/response')

const upload = (module.exports = {})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const saveDir = req.params.folderName || 'data'
        const ifExistDir = './public/uploads/' + saveDir

        if (!fs.existsSync(ifExistDir)) {
            fs.mkdirSync(ifExistDir, {
                recursive: true,
            })
        }

        cb(null, ifExistDir)
    },

    // By default, multer removes file extensions so const's add them back
    filename: function (req, file, cb) {
        const prefix = config.APP.FILE + '-' + Date.now()
        const filename = prefix + path.extname(file.originalname)
        console.log(`File ${filename} is uploaded`)
        cb(null, filename)
    },
})

upload.index = (req, res, next) => {
    const locales = res.locals.i18n.translations

    // 'uploaded_file' is the name of our file input field in the HTML form
    const uploadWithMulter = multer({
        storage: storage,
        fileFilter: helpers.imageFilter,
    }).single('uploaded_file')

    uploadWithMulter(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: req.fileValidationError },
                    },
                    locales
                )
            )
        } else if (!req.file) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: 'Please select an image to upload.' },
                    },
                    locales
                )
            )
        } else if (err instanceof multer.MulterError) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: err },
                    },
                    locales
                )
            )
        } else if (err) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: err },
                    },
                    locales
                )
            )
        }

        // Display uploaded image for user validation
        res.status(200).json(
            createResponse(
                200,
                {
                    data: {
                        message: 'File is successfully uploaded.',
                        data: req.file,
                    },
                },
                locales
            )
        )
    })
}

upload.multiUpload = (req, res, next) => {
    const locales = res.locals.i18n.translations

    // 10 is the limit I've defined for number of uploaded files at once
    // 'uploaded_files' is the name of our file input field
    const uploadWithMulter = multer({
        storage: storage,
        fileFilter: helpers.imageFilter,
    }).array('uploaded_files', 10)

    uploadWithMulter(req, res, function (err) {
        if (req.fileValidationError) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: req.fileValidationError },
                    },
                    locales
                )
            )
        } else if (!req.files) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: 'Please select images to upload.' },
                    },
                    locales
                )
            )
        } else if (err instanceof multer.MulterError) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: err },
                    },
                    locales
                )
            )
        } else if (err) {
            return res.status(400).json(
                createResponse(
                    400,
                    {
                        data: { message: err },
                    },
                    locales
                )
            )
        }

        // Display uploaded image for user validation
        res.status(200).json(
            createResponse(
                200,
                {
                    data: {
                        message: 'File are successfully uploaded.',
                        data: req.files,
                    },
                },
                locales
            )
        )
    })
}
