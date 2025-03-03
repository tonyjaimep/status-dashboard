import { useCallback, useEffect, useState } from "react";

enum ReplicaStatus {
  Healthy = "Healthy",
  Unhealthy = "Unhealthy",
  Down = "Down",
}

type Replica = {
  instance: string;
  status: ReplicaStatus;
  cpu_usage: number;
  memory_usage: number;
};

function App() {
  const [statuses, setStatuses] = useState<Replica[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    setIsLoading(true);
    const replicas = 3;
    const results = await Promise.all(
      Array.from({ length: replicas }, (_, i) =>
        fetch(`http://localhost:${8080 + i}/health`)
          .then((res) => res.json())
          .then((data) => ({
            instance: `web_${i + 1}`,
            status:
              data.status === "OK"
                ? ReplicaStatus.Healthy
                : ReplicaStatus.Unhealthy,
            cpu_usage: data.cpu_usage,
            memory_usage: data.memory_usage,
          }))
          .catch((e) => {
            console.log(e);

            return {
              instance: `web_${i + 1}`,
              status: ReplicaStatus.Down,
              cpu_usage: 0,
              memory_usage: 0,
            };
          }),
      ),
    );

    setStatuses(results);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchHealth();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchHealth]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Service Replica Status
        </h1>
        {isLoading && !statuses.length ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ul className="space-y-4">
            {statuses.map((s) => (
              <li
                key={s.instance}
                className="bg-white shadow-sm rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">
                    {s.instance}
                  </span>
                  <span
                    className={`text-lg font-semibold ${
                      s.status === ReplicaStatus.Healthy
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    CPU Usage: {s.cpu_usage.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Memory Usage: {s.memory_usage.toFixed(2)}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
