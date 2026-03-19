"use client";

type EmployeeAvatarProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export function EmployeeAvatar({
  name,
  imageUrl,
  className = "h-9 w-9",
}: EmployeeAvatarProps) {
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "EM";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${className} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 ${className}`}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
