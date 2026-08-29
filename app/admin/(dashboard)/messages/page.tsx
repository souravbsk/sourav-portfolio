import { AdminPageHeader } from "@/components/admin/admin-page";
import { MessageList } from "@/components/admin/message-list";
import { getMessages } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((message) => !message.read).length;

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description={
          messages.length === 0
            ? "Contact form submissions appear here."
            : `${messages.length} message${messages.length === 1 ? "" : "s"}${unread > 0 ? `, ${unread} unread` : ""}.`
        }
      />
      <MessageList messages={messages} />
    </>
  );
}
