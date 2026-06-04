import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Gauge from "./Gauge";
import TelemetryLineChart from "./TelemetryLineChart";
import HistoryTable from "./HistoryTable";
import GlassFocusWrap from "./GlassFocusWrap";

const socket = io("http://localhost:3000");

function Dashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onTelemetry = (newData) => {
      setData(newData);
      setHistory((prev) => [
        ...prev,
        {
          ...newData,
          timeLabel: `${newData.fecha ?? ""} ${newData.hora ?? ""}`.trim(),
        },
      ]);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("telemetry", onTelemetry);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("telemetry", onTelemetry);
    };
  }, []);

  return (
    <div className="app-backdrop">
      <div className="blob blob-a" aria-hidden="true" />
      <div className="blob blob-b" aria-hidden="true" />
      <div className="blob blob-c" aria-hidden="true" />

      <div className="container">
        <header className="dashboard-header glass-panel">
          <h1>Sistema de Riego Inteligente</h1>
          <span className={`status-pill ${connected ? "online" : "offline"}`}>
            {connected ? "Conectado al servidor" : "Sin conexión"}
          </span>
        </header>

        <p className="ui-tip glass-panel">
          Haz <strong>clic</strong> en un panel o mantén el cursor{" "}
          <strong>5 segundos</strong> sobre él para verlo a pantalla completa.
        </p>

        {!data && (
          <p className="waiting-banner glass-panel">Esperando datos del ESP32...</p>
        )}

        <section className="panel status-panel glass-panel">
          <GlassFocusWrap title="Estado del riego" className="status-card-wrap">
            <div className="status-card glass-inset">
              <span className="status-card-label">Estado del riego</span>
              <strong className="status-card-value">
                {data?.decision ?? "—"}
              </strong>
            </div>
          </GlassFocusWrap>

          <GlassFocusWrap title="Última actualización" className="status-card-wrap">
            <div className="status-card glass-inset">
              <span className="status-card-label">Última actualización</span>
              <strong className="status-card-value">
                {data ? `${data.fecha} · ${data.hora}` : "—"}
              </strong>
            </div>
          </GlassFocusWrap>
        </section>

        <section className="panel glass-panel">
          <h2 className="section-title">Lecturas en tiempo real</h2>
          <div className="gauges-row">
            <GlassFocusWrap
              title="Humedad del suelo"
              className="gauge-card-wrap"
              focusClassName="focus-gauge"
            >
              <div className="gauge-card glass-inset">
                <Gauge
                  value={data?.soilMoisture}
                  min={0}
                  max={100}
                  label="Humedad del suelo"
                  unit="%"
                  variant="soil"
                />
              </div>
            </GlassFocusWrap>

            <GlassFocusWrap
              title="Temperatura"
              className="gauge-card-wrap"
              focusClassName="focus-gauge"
            >
              <div className="gauge-card glass-inset">
                <Gauge
                  value={data?.temperatureC}
                  min={0}
                  max={50}
                  label="Temperatura"
                  unit="°C"
                  variant="temperature"
                />
              </div>
            </GlassFocusWrap>

            <GlassFocusWrap
              title="Humedad del aire"
              className="gauge-card-wrap"
              focusClassName="focus-gauge"
            >
              <div className="gauge-card glass-inset">
                <Gauge
                  value={data?.airHumidity}
                  min={0}
                  max={100}
                  label="Humedad del aire"
                  unit="%"
                  variant="air"
                />
              </div>
            </GlassFocusWrap>
          </div>
        </section>

        <GlassFocusWrap
          title="Gráficas de sensores"
          className="panel chart-panel-wrap glass-panel"
          focusClassName="focus-chart"
          focusChildren={<TelemetryLineChart history={history} expanded />}
        >
          <section className="panel-inner">
            <h2 className="section-title">Evolución de sensores en el tiempo</h2>
            <p className="charts-section-desc">
              Cada gráfica muestra un dato distinto frente al tiempo (fecha y hora de cada lectura).
            </p>
            <TelemetryLineChart history={history} />
          </section>
        </GlassFocusWrap>

        <HistoryTable history={history} />
      </div>
    </div>
  );
}

export default Dashboard;
