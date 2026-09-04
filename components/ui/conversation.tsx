import * as React from "react"

export interface ConversationProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col w-full overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
Conversation.displayName = "Conversation"

export interface ConversationContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ConversationContent = React.forwardRef<HTMLDivElement, ConversationContentProps>(
  ({ className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col gap-6 w-full py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
ConversationContent.displayName = "ConversationContent"
