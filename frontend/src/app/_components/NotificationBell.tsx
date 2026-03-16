"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/graphql/generated/graphql";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  linkPath?: string | null;
  createdAt: string;
  isRead: boolean;
};

const TYPE_COLORS: Record<string, string> = {
  queue_item: "bg-blue-100 text-blue-700",
  contract_expiring: "bg-amber-100 text-amber-700",
  contract_missing: "bg-red-100 text-red-700",
  suspended_enrollments: "bg-orange-100 text-orange-700",
  enrollment_suspended: "bg-orange-100 text-orange-700",
  rule_proposal_pending: "bg-violet-100 text-violet-700",
  request_status_change: "bg-slate-100 text-slate-700",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  // Optimistic local read set — lets the bell update instantly without waiting
  // for a refetch after markNotificationsRead fires.
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  const { data, refetch } = useGetNotificationsQuery({
    pollInterval: 60_000,
    fetchPolicy: "cache-and-network",
  });

  const [markRead] = useMarkNotificationsReadMutation();

  const notifications = useMemo(
    () => (data?.notifications ?? []) as Notification[],
    [data],
  );

  // isRead = server says read OR we've locally optimistically marked it
  const unreadCount = notifications.filter(
    (n) => !n.isRead && !localReadIds.has(n.id),
  ).length;

  const handleOpen = useCallback(() => {
    setOpen((prev) => {
      const opening = !prev;
      if (opening && notifications.length > 0) {
        const unreadIds = notifications
          .filter((n) => !n.isRead && !localReadIds.has(n.id))
          .map((n) => n.id);

        if (unreadIds.length > 0) {
          // Optimistically mark locally so the bell clears instantly
          setLocalReadIds((prev) => {
            const next = new Set(prev);
            unreadIds.forEach((id) => next.add(id));
            return next;
          });

          // Persist to backend — fire and forget, refetch confirms
          markRead({ variables: { keys: unreadIds } }).then(() => {
            refetch();
          });
        }
      }
      return opening;
    });
  }, [notifications, localReadIds, markRead, refetch]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleOpen}
        className="relative flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-full top-0 z-50 ml-3 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">Notifications</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <Bell className="h-8 w-8 text-slate-200" />
                <p className="text-sm font-medium text-slate-500">You&apos;re all caught up</p>
                <p className="text-xs text-slate-400">No notifications right now.</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.isRead && !localReadIds.has(n.id);
                const content = (
                  <div
                    className={`group flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition last:border-b-0 hover:bg-slate-50 ${isUnread ? "bg-blue-50/40" : ""}`}
                  >
                    <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${isUnread ? "bg-blue-500" : "bg-transparent"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{n.title}</p>
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${TYPE_COLORS[n.type] ?? "bg-slate-100 text-slate-600"}`}>
                          {n.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{n.body}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                );

                return n.linkPath ? (
                  <a key={n.id} href={n.linkPath} className="block" onClick={() => setOpen(false)}>
                    {content}
                  </a>
                ) : (
                  <div key={n.id}>{content}</div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
