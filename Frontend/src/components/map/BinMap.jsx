import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { binMarkerColor } from "../../lib/format.js";

export default function BinMap({
  bins = [],
  height = 420,
  center,
  zoom = 13,
  renderPopup,
}) {
  const first = bins[0];
  const fallback = [20.5937, 78.9629]; // India centroid
  const c =
    center ||
    (first ? [first.latitude, first.longitude] : fallback);

  return (
    <div style={{ height }} className="overflow-hidden rounded-2xl border border-line">
      <MapContainer center={c} zoom={zoom} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bins.map((b) => (
          <CircleMarker
            key={b.id}
            center={[b.latitude, b.longitude]}
            radius={10}
            pathOptions={{
              color: binMarkerColor(b.status),
              fillColor: binMarkerColor(b.status),
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              {renderPopup ? (
                renderPopup(b)
              ) : (
                <div className="min-w-[180px]">
                  <div className="font-semibold text-ink">{b.address}</div>
                  <div className="mt-1 text-xs text-body">
                    Status: <span className="font-medium">{b.status}</span>
                  </div>
                  {b.capacity != null && (
                    <div className="text-xs text-body">
                      Capacity: {b.capacity}
                    </div>
                  )}
                </div>
              )}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
