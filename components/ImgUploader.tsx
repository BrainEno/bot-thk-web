import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImgUploader = () => {
  const [message, setMessage] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles:File[]) => {
      const url = process.env.NEXT_PUBLIC_CLOUDINARY_URI!;
      console.log(url)
      const formData = new FormData();
      async () => {
        formData.append('file', acceptedFiles[0]);
        formData.append(
          'upload_preset',
          process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET!
        );
        formData.append(
          'cloud_name',
          process.env.NEXT_PUBLIC_CLOUNDINARY_NAME!
        );
        const reader=new FileReader();
        reader.onabort=()=>console.log('file reading was aborted');
        reader.onerror=()=>console.log('file reading has failed');
        reader.onload=()=>{
          const binary=reader.result;
          console.log(binary);
        }
        reader.readAsArrayBuffer(acceptedFiles[0]);

        try {
          const res = await fetch(url, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          const image_url = data.public_id;
          console.log(image_url);
        } catch (error) {
          setMessage('post image fail');
          console.log(message);
        }
      };
    },
    [message]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : null}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>正在上传...</p> : <p>拖拽上传</p>}
    </div>
  );
};

export default ImgUploader;
