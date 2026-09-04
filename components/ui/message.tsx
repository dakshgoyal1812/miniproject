import * as React from "react"

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  from?: "user" | "assistant"
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className = "", from = "user", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col gap-1.5 max-w-[85%] ${
        from === "user" ? "items-end ml-auto" : "items-start mr-auto"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
Message.displayName = "Message"

export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  from?: "user" | "assistant"
}

export const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className = "", from = "assistant", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
        from === "user"
          ? "bg-[#101828] text-white rounded-br-xs"
          : "bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
MessageContent.displayName = "MessageContent"
