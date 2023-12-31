import { createSignal, onCleanup } from 'solid-js';

type GenerateImageDTO = {
  code: string;
  lang: string;
  theme: string;
  font: string;
  format: string;
  upscale: number;
  showLineNumber: boolean;
  border: {
    colour: string;
    thickness: number;
    radius: number;
  };
};

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    if (blob === undefined) return reject("blob shouldn't be empty!");

    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result as string));

    reader.readAsDataURL(blob);
  });
}

export function useGenerateImage() {
  const abortController = new AbortController();
  const [isFetching, setFetching] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');
  const [image, setImage] = createSignal('');

  onCleanup(() => {
    abortController.abort();
  });

  async function generateImageAsync(payload: GenerateImageDTO) {
    try {
      setFetching(true);
      const lowerCasedLang = payload.lang.toLocaleLowerCase();
      const body = {
        code: payload.code,
        language: lowerCasedLang === 'auto detect' ? '' : lowerCasedLang === 'c#' ? 'csharp' : lowerCasedLang,
        theme: payload.theme.toLowerCase().replace(/\s/g, '-'),
        format: payload.format,
        upscale: payload.upscale,
        font: payload.font,
        border: {
          colour: payload.border.colour,
          thickness: payload.border.thickness,
          radius: payload.border.radius,
        },
        showLineNumber: payload.showLineNumber,
      };

      const imageResponse = await fetch('http://localhost:3000/api', {
        method: 'POST',
        headers: {
          Accept: `image/${payload.format}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abortController.signal,
      });

      if (!imageResponse.ok) {
        const err = await imageResponse.json();
        throw err.msg.toString();
      }

      setErrorMessage('');

      const imageBlob = await imageResponse.blob();
      setImage(await blobToBase64(imageBlob));
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setErrorMessage('Something went wrong on our side.');
      } else if (typeof err === 'string') {
        setErrorMessage(err);
      }
    } finally {
      setFetching(false);
    }
  }

  return {
    generateImageAsync,
    isFetching,
    errorMessage,
    image,
  };
}
