import { useState, useCallback } from 'react';

// A custom hook to handle streaming AI responses
export const useStreamAI = <T,>({
  onData, // Callback for when a complete JSON object is received
  onFinish, // Callback for when the stream is finished
  onError, // Callback for any errors
}: {
  onData: (data: T) => void;
  onFinish?: () => void;
  onError?: (error: Error) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const stream = useCallback(async (url: string, body: object) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, stream: true }), // Always stream
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is missing");
      }

      // --- Stream Processing Logic ---
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Look for the special "data:" prefix
        const parts = buffer.split('\n');
        buffer = parts.pop() || ''; // Keep the last, possibly incomplete, part

        for (const part of parts) {
          if (part.startsWith('data: ')) {
            const content = part.substring(6);
            if (content === '[DONE]') {
              continue; // Skip the [DONE] marker
            }
            try {
              const chunk = JSON.parse(content);
              if (chunk.choices && chunk.choices[0].delta.content) {
                 // This part is for streaming text, which we are not using now.
              }
            } catch (e) {
              // This is where we expect to see our full object
              try {
                  const fullJson = JSON.parse(buffer + part);
                  onData(fullJson);
                  // Reset buffer after successfully parsing a complete object
                  buffer = ''; 
              } catch (jsonParseError) {
                  // In case of error, append the part back to buffer and wait for more data
                  buffer += part;
              }
            }
          }
        }
      }
      // --- End of Stream Processing ---

      if (onFinish) {
        onFinish();
      }

    } catch (err: any) {
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onData, onFinish, onError]);

  return { stream, isLoading };
};
