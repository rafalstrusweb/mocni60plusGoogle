import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CameraPage() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let stream: MediaStream | null = null;
        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Nie można uzyskać dostępu do kamery.');
                console.error(err);
            }
        }
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
            <Button variant="ghost" className="absolute top-4 left-4 text-white z-50" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-8 h-8" />
            </Button>

            {error ? (
                <div className="text-white text-center p-4">
                    <p>{error}</p>
                    <Button onClick={() => navigate(-1)} className="mt-4">Wróć</Button>
                </div>
            ) : (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            )}

            {!error && (
                <div className="absolute bottom-10">
                    <Button
                        className="rounded-full w-20 h-20 bg-white hover:bg-gray-200 border-4 border-gray-400 transition-all active:scale-95"
                        onClick={() => alert("Zdjęcie zrobione! (Mock)")}
                    />
                </div>
            )}
        </div>
    );
}
