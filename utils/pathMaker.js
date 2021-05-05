const path = require('path')
const fileMaker = dir => path.join(path.dirname(process.mainModule.filename),'data' , dir)

module.exports = fileMaker