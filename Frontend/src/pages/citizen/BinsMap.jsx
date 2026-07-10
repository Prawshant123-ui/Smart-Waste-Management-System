import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import BinMap from "../../components/map/BinMap.jsx";
import { getBins } from "../../api/bins.js";

export default function BinsMapPage() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getBins()
      .then((d) => setBins(Array.isArray(d) ? d : d.bins || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Bins near you" subtitle="Tap a bin to report an issue against it." />
      {loading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <Card className="p-3">
          <BinMap
            bins={bins}
            height={560}
            renderPopup={(b) => (
              <div className="min-w-[200px]">
                <div className="font-semibold text-ink">{b.address}</div>
                <div className="text-xs text-body">Status: {b.status}</div>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate(`/citizen/complaints/new?binId=${b.id}`)}
                >
                  Report this bin
                </Button>
              </div>
            )}
          />
        </Card>
      )}
    </div>
  );
}
