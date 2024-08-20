const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://karabo_dev:i9uEO65KSrnexOPv@cluster0.zgt5sro.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log('Establising MongoDb Connection Pool...');
    _db = client.db();
    return client;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const getDb = () => {
  try {
    return _db;
  } catch (error) {
    throw `No database found! ERR:${error}`;
  }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
