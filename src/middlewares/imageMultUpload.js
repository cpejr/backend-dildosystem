const multer = require('multer');
var storage = multer.memoryStorage()

const multerImageUploader = multer({
    storage: storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
            cb(null, true);
        else cb({ error: 'File type not allowed' }, false);
    },
});

const multipleImageUpload = (singleName, arrayName, mode = "create") => {
    return (req, res, next) => {
        let config = [];
        if (singleName){
            config.push({name: singleName, maxCount: 1});
        }
        if (arrayName){
            config.push({name: arrayName, maxCount: 10});
        }
        multerImageUploader.fields(config)(req, res, function (err) {
            if (err) {
                //TODO melhorar essa mensagem de erro!
                return res.status(500).json(err);
            }
            if (!req.files && mode === "create")
                return res.status(400).json({ error: `${arrayName} is required` });

            return next();
        });
    };
};

module.exports = multipleImageUpload;