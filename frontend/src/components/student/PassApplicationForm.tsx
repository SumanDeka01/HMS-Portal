import { useState, type FormEvent } from "react";
import type { CreateGatePassInput } from "../../types/gatepass";

interface Props {
  onSubmit: (data: CreateGatePassInput) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

const initialForm: CreateGatePassInput = {
  reason: "",
  destination: "",
  outDate: "",
  expectedReturn: "",
  emergencyContact: "",
};

const PassApplicationForm = ({ onSubmit, onCancel, submitting }: Props) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const update = (field: keyof CreateGatePassInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (new Date(form.expectedReturn) <= new Date(form.outDate)) {
      setError("Expected return must be after your departure time.");
      return;
    }

    try {
      await onSubmit(form);
      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit application.",
      );
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Gate-pass details
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your outing details for warden approval.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="reason" className="text-sm font-medium text-gray-700">
          Reason for outing
        </label>
        <textarea
          id="reason"
          value={form.reason}
          onChange={(e) => update("reason", e.target.value)}
          className={inputClass}
          placeholder="e.g. Medical appointment"
          rows={3}
          maxLength={500}
          required
        />
      </div>

      <div>
        <label
          htmlFor="destination"
          className="text-sm font-medium text-gray-700"
        >
          Destination
        </label>
        <input
          id="destination"
          value={form.destination}
          onChange={(e) => update("destination", e.target.value)}
          className={inputClass}
          placeholder="Where are you going?"
          maxLength={200}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="outDate"
            className="text-sm font-medium text-gray-700"
          >
            Departure date and time
          </label>
          <input
            id="outDate"
            type="datetime-local"
            value={form.outDate}
            onChange={(e) => update("outDate", e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label
            htmlFor="expectedReturn"
            className="text-sm font-medium text-gray-700"
          >
            Expected return
          </label>
          <input
            id="expectedReturn"
            type="datetime-local"
            value={form.expectedReturn}
            min={form.outDate || undefined}
            onChange={(e) => update("expectedReturn", e.target.value)}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="emergencyContact"
          className="text-sm font-medium text-gray-700"
        >
          Emergency contact
        </label>
        <input
          id="emergencyContact"
          type="tel"
          value={form.emergencyContact}
          onChange={(e) => update("emergencyContact", e.target.value)}
          className={inputClass}
          placeholder="Contact number"
          maxLength={20}
          required
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </form>
  );
};

export default PassApplicationForm;
