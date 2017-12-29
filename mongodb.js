'use strict'
const mongoClient = require('mongodb').MongoClient
const co = require('co')
const mongo = (() => {
  const dbUrl = 'mongodb://localhost:27017/messages'
  let mongoDb
  const closeDb = () => {
    if (mongoDb !== undefined && mongoDb !== null) {
      mongoDb.close()
    }
  }
  const resolveData = (req, data, resolve, infoMessage) => {
    closeDb()
    resolve(data)
  }
  const handleError = (req, err, reject, errorMessage, data) => {
    closeDb()
    reject(err)
  }
  return {
    create: (collectionName, doc, req) =>
      new Promise((resolve, reject) => {
        co(function * () {
          mongoDb = yield mongoClient.connect(dbUrl)
          let insertedDoc = yield mongoDb.collection(collectionName).insertOne(doc)
          resolveData(req, { id: insertedDoc.insertedId + '', audit: doc.audit }, resolve, 'Data is saved successfully')
        })
        .catch((err) => handleError(req, err, reject, 'Error saving data to Mongodb', doc))
      }),
    find: (collectionName, conditions, selections, req, sortCriteria, aggregationPipes) =>
      new Promise((resolve, reject) => {
        co(function * () {
          mongoDb = yield mongoClient.connect(dbUrl)
          let data
          if (aggregationPipes && aggregationPipes !== undefined) {
            data = yield mongoDb.collection(collectionName).aggregate(aggregationPipes).toArray()
          } else {
            data = yield mongoDb.collection(collectionName).find(conditions, selections).sort(sortCriteria).toArray()
          }
          resolveData(req, data, resolve, 'Data is retrieved successfully')
        })
        .catch((err) => handleError(req, err, reject, 'Error retrieving data from Mongodb', conditions))
      }),
    delete: (collectionName, conditions, req) =>
      new Promise((resolve, reject) => {
        co(function * () {
          mongoDb = yield mongoClient.connect(dbUrl)
          let data = yield mongoDb.collection(collectionName).deleteMany(conditions)
          resolveData(req, data, resolve, 'Data is deleted successfully')
        })
        .catch((err) => handleError(req, err, reject, 'Fail delete data from Mongodb', conditions))
      }),
    update: (collectionName, conditions, newData, req) =>
      new Promise((resolve, reject) => {
        co(function * () {
          mongoDb = yield mongoClient.connect(dbUrl)
          let data = yield mongoDb.collection(collectionName).updateMany(conditions, newData)
          resolveData(req, data, resolve, 'Data is updated successfully')
        })
        .catch((err) => handleError(req, err, reject, 'Fail update data from Mongodb', newData))
      })
  }
})()
module.exports = mongo
