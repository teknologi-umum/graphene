import { createSignal } from 'solid-js';

type GenerateImageDTO = {
  code: string;
  lang: string;
  theme: string;
  font: string;
  format: string;
  upscale: number;
  lineNumber: boolean;
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
  const [isFetching, setFetching] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal('');
  const [image, setImage] = createSignal('');

  async function generateImageAsync(payload: GenerateImageDTO) {
    try {
      setFetching(true);
      const lowerCasedLang = payload.lang.toLocaleLowerCase();
      const body = {
        code: payload.code,
        lang: lowerCasedLang === 'auto detect' ? '' : lowerCasedLang === 'c#' ? 'csharp' : lowerCasedLang,
        theme: payload.theme.toLowerCase().replace(/\s/g, '-'),
        format: payload.format,
        upscale: payload.upscale,
        font: payload.font,
        border: {
          colour: payload.border.colour,
          thickness: payload.border.thickness,
          radius: payload.border.radius,
        },
        lineNumber: payload.lineNumber,
      };

      const imageResponse = await fetch('/api', {
        method: 'POST',
        headers: {
          Accept: `image/${payload.format}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
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
        // eslint-disable-next-line no-console
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
    hasError: errorMessage() !== undefined && errorMessage().length > 0,
    hasImage: image() !== undefined && image().length > 0,
  };
}
