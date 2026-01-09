"use client";

import { useEffect, useState } from "react";

interface S3Object {
  key: string;
  size: number;
  lastModified: string;
  url?: string;
}

export default function S3PanelPage() {
  const [objects, setObjects] = useState<S3Object[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const imageObjects = objects.filter((obj) => {
    const lower = obj.key.toLowerCase();
    return (
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".webp")
    );
  });

  const fetchObjects = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await fetch("/api/s3/list");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Listeleme hatası");
      setObjects(data.objects || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Listeleme sırasında hata oluştu");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!file) {
      setError("Lütfen bir dosya seçin.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/s3/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme hatası");

      setSuccess("Dosya başarıyla yüklendi.");
      form.reset();
      await fetchObjects();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Yükleme sırasında hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">S3 Öğrenme Paneli</h1>
        <p className="text-sm text-muted-foreground">
          Bu panel ile S3 bucket&apos;ına dosya yükleyip mevcut objeleri listeleyerek S3 mantığını
          öğrenebilirsiniz.
        </p>
      </div>

      <section className="border rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold">Dosya Yükle</h2>
        <form onSubmit={handleUpload} className="space-y-3">
          <input
            type="file"
            name="file"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Yükleniyor..." : "Yükle"}
          </button>
        </form>
      </section>

      <section className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bucket İçeriği</h2>
          <button
            onClick={fetchObjects}
            className="px-3 py-1 rounded-md border text-sm"
            disabled={loadingList}
          >
            {loadingList ? "Yenileniyor..." : "Yenile"}
          </button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {objects.length === 0 && !loadingList && (
          <p className="text-sm text-muted-foreground">
            Henüz obje yok. Yukarıdan bir dosya yükleyerek başlayabilirsiniz.
          </p>
        )}

        {objects.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2">Key</th>
                  <th className="text-left px-3 py-2">Boyut (KB)</th>
                  <th className="text-left px-3 py-2">Son Güncelleme</th>
                </tr>
              </thead>
              <tbody>
                {objects.map((obj) => (
                  <tr key={obj.key} className="border-t">
                    <td className="px-3 py-2 break-all">{obj.key}</td>
                    <td className="px-3 py-2">{(obj.size / 1024).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      {obj.lastModified
                        ? new Date(obj.lastModified).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Galeri (Sadece Görseller)</h2>
          <span className="text-xs text-muted-foreground">
            Toplam görsel: {imageObjects.length}
          </span>
        </div>

        {imageObjects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Henüz görüntü dosyası yok. .png, .jpg vb. bir dosya yüklediğinizde burada görünecek.
          </p>
        )}

        {imageObjects.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imageObjects.map((img) => (
              <div key={img.key} className="flex flex-col items-center space-y-1">
                {img.url ? (
                  // Bucket public ise direkt URL'den gösterir
                  <img
                    src={img.url}
                    alt={img.key}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center rounded-md border text-xs text-muted-foreground text-center px-2">
                    URL bulunamadı (bucket public değil)
                  </div>
                )}
                <span className="text-[10px] break-all text-center">
                  {img.key.replace(/^uploads\//, "")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

