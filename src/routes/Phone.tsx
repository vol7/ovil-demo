import { Outlet } from "react-router"

/**
 * Owner phone surface. Fills the window when it is phone-sized (open it at 390×844
 * for recording); on a wider window it is framed and centered on a dark backdrop.
 * Child routes: the Messages thread and the confirmation page opened from the SMS link.
 */
export function Phone() {
  return (
    <main className="flex min-h-svh items-stretch justify-center bg-neutral-950 sm:items-center sm:p-6">
      <div className="h-svh w-full sm:h-[844px] sm:w-[390px] sm:overflow-hidden sm:rounded-[44px] sm:shadow-[0_0_0_10px_#1c1c1e,0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <Outlet />
      </div>
    </main>
  )
}
