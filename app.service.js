const mongoose = require('./app.mongoose');

function findURL(queryUrl) {
  return new Promise((resolve, reject) => {
    
    mongoose.URL.findOne(queryUrl, (err, record) => {
      if (err) return reject(err);
      return resolve(record);
    });

  });

}

function saveURL(urlString, seq) {
  return new Promise((resolve, reject) => {
    let url = new mongoose.URL({
      original_url: urlString,
      short_url: seq
    });
    url.save((err, record) => {
      if (err) return reject(err);
      console.log("Inside save url :: ",record);
      return resolve(record);
    })

  })
}

function getSeq(seqName) {
  return new Promise((resolve, reject) => {

    mongoose.SQUENCER.findOneAndUpdate({ seq_name: seqName }, { $inc: { counter: 1 } }, { upsert: true }
      , (err, seq) => {
        console.log("Inside getseq method :: ", seq);
        if (err) return reject(err);
        return resolve(seq);
      })

  });
}

module.exports = { findURL, saveURL, getSeq };