const AWSModel = require('../models/AWSModel')
const fs = require('fs')
const util = require('util')
const { response } = require('express')
const unlinkFile = util.promisify(fs.unlink)

module.exports = {

  async getImagesAWS(req, res) {
    try {
      console.log(req.params)
      const key = req.params.key
      const readStream = await AWSModel.getAWS(key)

      // readStream.pipe(res)

      return res.status(200).send(readStream)
    }
    catch (err) {
      console.log(err)
      return response.status(500).json({ notification: "Internal server error while trying to get images" });
    }
  },

  async uploadImagesAWS(req, res) {
    try {
      const file = req.file
      console.log('File: ',file)
      const resultAWS = await AWSModel.uploadAWS(file)
      await unlinkFile(file.path)
      console.log('Upload: ',resultAWS)
      
      // res.send({ imaPath: `./image/${resultAWS.key}` })
      return res.status(200).json('Deu certo!')
    }
    catch (err) {
      console.log(err)
      return response.status(500).json({ notification: "Internal server error while trying to upload images" });
    }
  },

  async deleteImagesAWS(req, res) {
    try {
      const key = req.params.key
      const result = await AWSModel.deleteAWS(key)
      // console.log('Delete: ',result)

      return res.status(200).json({ message: 'Deletado com sucesso!'});
    }catch (err) {
      console.log(err)
      return response.status(500).json({ notification: "Internal server error while trying to delete image" });
    }
  }
}