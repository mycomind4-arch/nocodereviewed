import { useState } from "react";

export default function BreakEvenCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(5000);
  const [growthRate, setGrowthRate] = useState(15);
  const [noCodeMonthly, setNoCodeMonthly] = useState(99);
  const [devSalary, setDevSalary] = useState(8000);
  const [buildMonths, setBuildMonths] = useState(6);
  const [teamSize, setTeamSize] = useState(1);

  const noCodeBuildCost = 500;
  const customDevBuildCost = devSalary * buildMonths * teamSize;

  const months = Array.from({ length: 36 }, (_, i) => i + 1);

  function getRevenue(month) {
    return monthlyRevenue * Math.pow(1 + growthRate / 100, month - 1);
  }

  function getNoCodeCost(month) {
    return noCodeBuildCost + noCodeMonthly * month;
  }

  function getCustomDevCost(month) {
    return customDevBuildCost + (devSalary * 0.3 * month);
  }

  const breakEvenMonth = months.find(m => {
    const rev = getRevenue(m);
    return rev > getCustomDevCost(m) - getNoCodeCost(m) + noCodeMonthly;
  });

  const month36NoCode = getNoCodeCost(36);
  const month36Custom = getCustomDevCost(36);
  const month36Rev = getRevenue(36);
  const savings = Math.round(month36Custom - month36NoCode);

  const chartMonths = [3, 6, 12, 18, 24, 36];
  const maxVal = Math.max(...chartMonths.map(m => Math.max(getNoCodeCost(m), getCustomDevCost(m), getRevenue(m))));

  return (
    <div style={{ fontFamily: "var(--font-sans)", padding: "1.5rem 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)", margin: 0 }}>Your project</h3>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Starting monthly revenue</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>${monthlyRevenue.toLocaleString()}</span>
            </div>
            <input type="range" min={500} max={50000} step={500} value={monthlyRevenue} onChange={e => setMonthlyRevenue(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Monthly growth rate</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{growthRate}%</span>
            </div>
            <input type="range" min={0} max={50} step={1} value={growthRate} onChange={e => setGrowthRate(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>No-code platform cost/mo</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>${noCodeMonthly}</span>
            </div>
            <input type="range" min={0} max={500} step={5} value={noCodeMonthly} onChange={e => setNoCodeMonthly(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)", margin: 0 }}>Custom dev scenario</h3>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Developer salary/mo</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>${devSalary.toLocaleString()}</span>
            </div>
            <input type="range" min={2000} max={20000} step={500} value={devSalary} onChange={e => setDevSalary(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Months to build</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{buildMonths} mo</span>
            </div>
            <input type="range" min={1} max={24} step={1} value={buildMonths} onChange={e => setBuildMonths(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Developers needed</label>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{teamSize}</span>
            </div>
            <input type="range" min={1} max={5} step={1} value={teamSize} onChange={e => setTeamSize(Number(e.target.value))} style={{ width: "100%" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: "1.5rem" }}>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>No-code build cost</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-success)" }}>${noCodeBuildCost.toLocaleString()}</div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Custom dev build cost</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "var(--color-text-danger)" }}>${customDevBuildCost.toLocaleString()}</div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>3-year savings (no-code)</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: savings > 0 ? "var(--color-text-success)" : "var(--color-text-danger)" }}>
            {savings > 0 ? "+" : ""}${Math.abs(savings).toLocaleString()}
          </div>
        </div>
        <div style={{ background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "1rem" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>Switch to dev at</div>
          <div style={{ fontSize: 20, fontWeight: 500 }}>{breakEvenMonth ? `Mo ${breakEvenMonth}` : "Never"}</div>
        </div>
      </div>

      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1.25rem" }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 1rem" }}>36-month cost comparison</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: "0.75rem", flexWrap: "wrap" }}>
          {[
            { label: "No-code total", color: "#1D9E75" },
            { label: "Custom dev total", color: "#E24B4A" },
            { label: "Revenue", color: "#378ADD" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
        {chartMonths.map(m => {
          const nc = getNoCodeCost(m);
          const cd = getCustomDevCost(m);
          const rv = getRevenue(m);
          return (
            <div key={m} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 4 }}>Month {m}</div>
              {[
                { val: nc, color: "#1D9E75", label: `$${Math.round(nc).toLocaleString()}` },
                { val: cd, color: "#E24B4A", label: `$${Math.round(cd).toLocaleString()}` },
                { val: rv, color: "#378ADD", label: `$${Math.round(rv).toLocaleString()}` },
              ].map(({ val, color, label }) => (
                <div key={color} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((val / maxVal) * 100, 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.4s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--color-text-secondary)", minWidth: 70, textAlign: "right" }}>{label}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {breakEvenMonth && breakEvenMonth <= 36 && (
        <div style={{ marginTop: 12, padding: "12px 16px", background: "var(--color-background-warning)", borderRadius: "var(--border-radius-md)", fontSize: 13, color: "var(--color-text-warning)" }}>
          ⚡ At your growth rate, custom dev becomes cost-competitive around month {breakEvenMonth}. Consider migrating when you hit that milestone.
        </div>
      )}
      {(!breakEvenMonth || breakEvenMonth > 36) && (
        <div style={{ marginTop: 12, padding: "12px 16px", background: "var(--color-background-success)", borderRadius: "var(--border-radius-md)", fontSize: 13, color: "var(--color-text-success)" }}>
          ✓ No-code stays cheaper than custom dev for your entire 3-year horizon. Build on no-code.
        </div>
      )}
    </div>
  );
}
