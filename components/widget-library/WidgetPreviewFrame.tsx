type WidgetPreviewFrameProps = {
  children: React.ReactNode;
  mode?: "rendered" | "placeholder";
};

export default function WidgetPreviewFrame({
  children,
  mode = "rendered"
}: WidgetPreviewFrameProps) {
  return (
    <div className="w-full h-[180px] overflow-hidden rounded-xl border border-ink/10 bg-neutral-50 flex items-start justify-center">
      <div
        className="w-[900px] min-h-[520px] bg-white origin-top-left"
        style={{ transform: "scale(0.22)" }}
      >
        <div className={mode === "placeholder" ? "p-6" : "p-6"}>{children}</div>
      </div>
    </div>
  );
}
