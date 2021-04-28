const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const connection = require("../database/connection");

const region = process.env.AWS_BUCKET_REGION
const accessKeyId =  process.env.AWS_ACCESS_KEY
const secretAccessKey =  process.env.AWS_SECRET_ACCESS_KEY
const bucketName = process.env.AWS_BUCKET_NAME


//Instancia do AWS S3
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
})

module.exports = {

  uploadAWS(file) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileStream = fs.createReadStream(file.path)

        const uploadParams = {
          Bucket: bucketName,
          Body: fileStream,
          Key: file.filename
        }

        const awsRes = await s3.upload(uploadParams).promise()

        resolve(awsRes)
      }
      catch (error) {
        console.log(error)
        reject(error)
      }
    })
  },

  async getAWS(fileKey) {
    return new Promise((resolve, reject) => {
      try {
        const downloadParams = {
          Key: fileKey,
          Bucket: bucketName
        }
        resolve(s3.getObject(downloadParams).createReadStream())
      }
      catch (error) {
        console.log(error)
        reject(error)
      }
    })
  },

  async deleteAWS(fileKey) {
    return new Promise((resolve, reject) => {
      try {
        const deleteParams = {
          Bucket: bucketName,
          Key: fileKey,
        }

        resolve(s3.deleteObject(deleteParams, (err, data) => {
          if (err) console.log('Erro no delete!', err)
          else console.log('Deletado!')
        }))
      }
      catch (error) {
        console.log(error)
        reject(error)
      }
    })
  }
}
