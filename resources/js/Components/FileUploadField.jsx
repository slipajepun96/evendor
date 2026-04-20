import { useRef, useState } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function FileUploadField({
    field,
    label,
    onUploaded,
    error,
    required = false,
    accept = '.pdf',
    maxSize = 5,
}) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const doUpload = async (file) => {
        setUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('field', field);

        try {
            const response = await fetch(route('vendor.upload-temp-file'), {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData,
            });

            if (!response.ok) {
                const json = await response.json().catch(() => ({}));
                throw new Error(json.message ?? `Upload gagal (${response.status})`);
            }

            const json = await response.json();
            setUploadedFile({ name: file.name, size: file.size });
            onUploaded(json.path);
        } catch (err) {
            setUploadError(err.message ?? 'Upload gagal. Sila cuba lagi.');
            setUploadedFile(null);
            onUploaded('');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxBytes = maxSize * 1024 * 1024;
        if (file.size > maxBytes) {
            setUploadError(`Saiz fail melebihi had ${maxSize}MB.`);
            e.target.value = '';
            return;
        }

        doUpload(file);
        e.target.value = '';
    };

    const handleRemove = () => {
        setUploadedFile(null);
        setUploadError('');
        onUploaded('');
    };

    return (
        <div className="mt-1">
            {label && (
                <InputLabel
                    value={
                        <>
                            {label}
                            {required && <span className="text-red-500"> *</span>}
                        </>
                    }
                />
            )}

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={handleChange}
            />

            {!uploadedFile ? (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-4 text-sm text-gray-500 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-60"
                >
                    <Upload className="h-4 w-4" />
                    <span>
                        {uploading
                            ? 'Memuat naik...'
                            : `Pilih fail (maks ${maxSize}MB)`}
                    </span>
                </button>
            ) : (
                <div className="mt-1 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <FileIcon className="h-5 w-5 shrink-0 text-indigo-500" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-700">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(uploadedFile.size)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="shrink-0 rounded px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-100"
                    >
                        Tukar
                    </button>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                        aria-label="Buang fail"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {uploadError && (
                <p className="mt-1 text-sm text-red-600">{uploadError}</p>
            )}

            {error && <InputError message={error} className="mt-1" />}
        </div>
    );
}
