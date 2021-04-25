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

        const data = {
          id: 'testAWS4',
          name: 'test',
          client_price: 23.99,
          description: 'test',
          image_id: awsRes.key
        }

        const response = await connection('testAWS').insert(data)

        const res = {
          response,
          awsRes
        }

        resolve(res)
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
        s3.getObject(downloadParams, (err, data) =>{
          if(err){
            return resolve({ error: err })
          }
          console.log(data)
          resolve(data)
        })
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
          if (err) console.log('Erro no delete!')
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
