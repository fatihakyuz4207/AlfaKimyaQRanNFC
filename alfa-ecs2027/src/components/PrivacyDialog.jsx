export function PrivacyDialog({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        className="max-h-[80dvh] w-full max-w-[430px] overflow-auto rounded-t-[28px] bg-white p-5 sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="privacy-title" className="text-xl font-semibold tracking-tight">
          Privacy notice
        </h2>
        <div className="mt-3 grid gap-3 text-sm leading-relaxed text-slate-600">
          <p>
            Browsing resins, watching the application loop and downloading a preview TDS does not ask for your email and does not create an account.
          </p>
          <p>
            Your shortlist is stored in this browser only. Alfa receives your email address when you request the mini catalog and tick the consent box. The legal basis is consent, GDPR Article 6(1)(a).
          </p>
          <p>
            The catalog email covers the resins you selected. A matching note goes to the ECS stand sales team. You can withdraw consent by replying to that email.
          </p>
          <p>
            This build is a stand prototype. With no mail webhook configured, the address stays in this browser so the team can demonstrate the flow. Set the webhook before the show to deliver through your mail provider. The insights board can erase saved addresses on this device.
          </p>
        </div>
        <button type="button" className="mt-5 h-11 w-full rounded-2xl bg-alfa text-sm font-semibold text-white" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
