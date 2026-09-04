import * as React from "react"

export interface ActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Actions = React.forwardRef<HTMLDivElement, ActionsProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center gap-1 text-slate-500 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
Actions.displayName = "Actions"

export interface ActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
}

export const Action = React.forwardRef<HTMLButtonElement, ActionProps>(
  ({ className = "", label, children, ...props }, ref) => (
    <button
      ref={ref}
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center p-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  )
)
Action.displayName = "Action"
