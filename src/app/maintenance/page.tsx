export const metadata = {
  title: {
    absolute: "Sistem Sedang Pemeliharaan",
  },
};

export default function MaintenancePage() {
  const pusdatinUrl =
    process.env.NEXT_PUBLIC_PUSDATIN_URL ||
    "https://pusdatin.kemenag-baritoutara.go.id";

  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-hidden bg-slate-50 z-[99999]">
      <iframe
        src={`${pusdatinUrl}/maintenance?app=E-SOP+Digital`}
        className="w-full h-full border-0"
        title="Sistem Sedang Pemeliharaan"
      />
    </div>
  );
}
