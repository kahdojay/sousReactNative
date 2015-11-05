import { S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../resources/apiConfig'

export const uploadToS3 = function(image, sessionData, callback) {
  console.log('uploading...')
  console.log('image is', image)
  var textParams = [];
  textParams.push({ name: "key", value: 'avatar_' + sessionData.userId + ".jpg" })
  textParams.push({ name: "AWSAccessKeyId", value: AWS_ACCESS_KEY_ID })
  textParams.push({ name: "acl", value: "public-read" })
  textParams.push({ name: "success_action_status", value: "201" })
  textParams.push({ name: "policy", value: '' })
  textParams.push({ name: "signature", value: 'v4' })
  textParams.push({ name: "Content-Type", value: "image/jpeg" })
  console.log('textParams', textParams);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://' + S3_BUCKET + '.s3.amazonaws.com/');
  xhr.onload = () => {
  //   this.setState({ isUploading: false });
    if (xhr.status !== 201) {
      console.log('error', xhr);
      return;
    }

    if (!xhr.responseText) {
      console.log('failed, no payload', xhr)
      return;
    }
    var index = xhr.responseText.indexOf( "http://" + S3_BUCKET + '.s3.amazonaws.com/');
    if (index === -1) {
      console.log('upload failed, invalid response payload');
      return;
    }
    var url = xhr.responseText.slice(index).split('\n')[0];
    var s3_file_id = xhr.responseText.split('Tag>"')[1].split('"')[0]
    var s3_file_path = xhr.responseText.split('Location>')[1].split('<')[0]
    // this.setState({ isUploading: false });
  //   RCTDeviceEventEmitter.emit('Uploaded')
  };
  var formdata = new FormData();

  textParams.forEach((param) => {
      formdata.append(param.name, param.value)
    }
  );

  formdata.append('file', {image, name: ('avatar_' + sessionData.userId + ".jpg") });

  xhr.send(formdata);
  // this.setState({ isUploading: true });
  callback();
}
