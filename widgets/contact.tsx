import { Theme } from "@/lib/schema";
import EditableText from "@/components/EditableText";

type ContactProps = {
  variant: string;
  props: {
    title: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  theme: Theme;
  editable?: boolean;
  onEdit?: (path: string, value: any) => void;
};

export default function Contact({ variant, props, editable, onEdit }: ContactProps) {
  const centered = variant === "centered";
  return (
    <section id="contact" className="px-6 py-16">
      <div
        className={`mx-auto max-w-6xl rounded-[36px] border border-slate-200 bg-white p-10 shadow-sm ${
          centered ? "text-center" : ""
        }`}
      >
        {editable && onEdit ? (
          <EditableText
            as="h2"
            className="text-3xl font-semibold text-slate-900"
            value={props.title}
            onChange={(value) => onEdit("title", value)}
          />
        ) : (
          <h2 className="text-3xl font-semibold text-slate-900">{props.title}</h2>
        )}
        <div
          className={`mt-8 grid gap-6 text-sm text-slate-600 ${
            centered ? "md:grid-cols-2" : "md:grid-cols-4"
          }`}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ტელეფონი</p>
            {editable && onEdit ? (
              <EditableText
                as="p"
                className="mt-2 font-semibold text-slate-900"
                value={props.phone}
                onChange={(value) => onEdit("phone", value)}
              />
            ) : (
              <p className="mt-2 font-semibold text-slate-900">{props.phone}</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">ელ. ფოსტა</p>
            {editable && onEdit ? (
              <EditableText
                as="p"
                className="mt-2 font-semibold text-slate-900"
                value={props.email}
                onChange={(value) => onEdit("email", value)}
              />
            ) : (
              <p className="mt-2 font-semibold text-slate-900">{props.email}</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">მისამართი</p>
            {editable && onEdit ? (
              <EditableText
                as="p"
                className="mt-2 font-semibold text-slate-900"
                value={props.address}
                onChange={(value) => onEdit("address", value)}
              />
            ) : (
              <p className="mt-2 font-semibold text-slate-900">{props.address}</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">სამუშაო საათები</p>
            {editable && onEdit ? (
              <EditableText
                as="p"
                className="mt-2 font-semibold text-slate-900"
                value={props.hours}
                onChange={(value) => onEdit("hours", value)}
              />
            ) : (
              <p className="mt-2 font-semibold text-slate-900">{props.hours}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
