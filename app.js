var AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws.config.json');

//Instantiate and set API version
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

s3.listBuckets(function(err, data) {
  if (err) { console.log("Error:", err); }
  else {
    for (var index in data.Buckets) {
      var bucket = data.Buckets[index];
      console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
    }
  }
});

//List all objects in a bucket
// s3.listObjectsV2({Bucket: 'projetos-frontend'}, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

//Get the object and save in a file
// var params = {Bucket: 'projetos-frontend', Key: 'sn-tempo.tar.gz'};
// var file = require('fs').createWriteStream(params.Key);
// s3.getObject(params).createReadStream().pipe(file);
