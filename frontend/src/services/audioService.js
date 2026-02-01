/**
 * Audio recording service using MediaRecorder API
 */

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
    }

    /**
     * Start recording audio
     */
    async startRecording() {
        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create MediaRecorder instance
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.audioChunks = [];

            // Collect audio data
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            // Start recording
            this.mediaRecorder.start();

            return true;
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw new Error('Microphone access denied or not available');
        }
    }

    /**
     * Stop recording and return audio blob
     * @returns {Promise<Blob>}
     */
    async stopRecording() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error('No active recording'));
                return;
            }

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });

                // Stop all tracks
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }

                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
        });
    }

    /**
     * Check if recording is active
     */
    isRecording() {
        return this.mediaRecorder && this.mediaRecorder.state === 'recording';
    }
}

/**
 * Upload audio blob to cloud storage
 * For MVP: Returns mock URL
 * For Production: Implement actual upload to Supabase/Firebase
 */
export const uploadAudio = async (audioBlob) => {
    try {
        if (DEMO_MODE) {
            // Mock upload - just return a placeholder URL
            return 'https://example.com/audio/mock-recording.webm';
        }

        // TODO: Production implementation
        // Option 1: Upload to Supabase Storage
        // const { data, error } = await supabase.storage
        //   .from('audio-recordings')
        //   .upload(`recordings/${Date.now()}.webm`, audioBlob);
        // if (error) throw error;
        // return data.publicUrl;

        // Option 2: Upload to Firebase Storage
        // const storageRef = ref(storage, `recordings/${Date.now()}.webm`);
        // await uploadBytes(storageRef, audioBlob);
        // return await getDownloadURL(storageRef);

        // For now, return mock URL
        return 'https://example.com/audio/recording.webm';
    } catch (error) {
        console.error('Audio upload failed:', error);
        throw new Error('Failed to upload audio');
    }
};

/**
 * Convert audio blob to base64 (alternative to upload)
 */
export const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Export singleton instance
export const audioRecorder = new AudioRecorder();

export default {
    audioRecorder,
    uploadAudio,
    blobToBase64,
};
