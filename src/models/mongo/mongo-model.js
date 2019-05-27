'use strict';

class Model {
  constructor(schema) {
    this.schema = schema;
  }

  get(_id) {
    let queryObject = _id ? { _id } : {};
    return this.schema.find(queryObject).then(result => {
      let data = { rows: result, rowCount: result.length };
      return new Promise(resolve => resolve(data));
    });
  }

  post(record) {
    console.log('posting!');
    let { title, author, isbn, image_url, description } = record;
    let values = [title, author, isbn, image_url, description];
    console.log(record);
    let newRecord = new this.schema(values);
    return newRecord.save().then(data => {
      //convert to data that can be readable
      let result = { rows: [data], rowCount: [data].length };
      return new Promise(resolve => resolve(result));
    });
  }

  put(_id, record) {
    return this.schema.findByIdAndUpdate(_id, record, { new: true });
  }

  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }
}

module.exports = Model;
