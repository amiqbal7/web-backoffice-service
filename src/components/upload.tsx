import { useState } from 'react';
import { FileInput, Progress } from 'flowbite-react';
import * as tus from 'tus-js-client';

const endpoint = `${import.meta.env.VITE_BASE_API_URL}/uploads`;

export function FileUpload({ onFinish, ...props }: {
  helperText?: React.ReactNode;
  color?: string;
  onFinish: (url: string | null) => void;
  [key: string]: unknown;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    color: 'failure' | 'success';
    content: React.ReactNode;
  } | null>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file: File = event.target.files[0];

    // Only continue if a file has actually been selected.
    // IE will trigger a change event even if we reset the input element
    // using reset() and we do not want to blow up later.
    if (!file) return;

    const upload = new tus.Upload(file, {
      endpoint,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      addRequestId: true,
      onProgress: (bytesUploaded, bytesTotal) => {
        setProgress(Math.floor((bytesUploaded / bytesTotal) * 100));
      },
      onSuccess: () => {
        event.target.value = '';
        setLoading(false);
        setMessage({
          color: 'success',
          content: 'Berkas berhasil diunggah',
        });
        onFinish(upload.url);
      },
      onError: () => {
        event.target.value = '';
        setLoading(false);
        setMessage({
          color: 'success',
          content: 'Berkas berhasil diunggah',
        });
        onFinish(upload.url);
      },
    });

    setProgress(0);
    setLoading(true);
    upload.start();
  };

  return (
    <div className='relative'>
      <FileInput
        {...props}
        onChange={(event) => handleChange(event)}
        helperText={message ? message.content : (props?.helperText ?? '')}
        color={message ? message.color : (props?.color ?? 'gray')}
      />

      {loading && (
        <div className='absolute top-0 left-0 text-white w-full h-full flex flex-col justify-center bg-gray-500/90 rounded px-2'>
          <Progress
            className='w-full'
            labelProgress
            labelText
            progress={progress}
            progressLabelPosition="inside"
            textLabel="Uploading..."
            textLabelPosition="outside"
            size='lg'
          />
        </div>
      )}
    </div>
  );
}
