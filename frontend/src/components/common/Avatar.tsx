import { useState } from "react";

import "./Avatar.css";

type AvatarSize = "small" | "medium" | "large";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: AvatarSize;
  className?: string;
  alt?: string;
}

const Avatar = ({
  name,
  imageUrl,
  size = "medium",
  className = "",
  alt,
}: AvatarProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <div
      className={[
        "app-avatar",
        `app-avatar-${size}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role={alt ? "img" : undefined}
      aria-label={alt}
      title={name}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={alt ?? name}
          className="app-avatar-image"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span
          className="app-avatar-initials"
          aria-hidden={Boolean(alt)}
        >
          {initials || "?"}
        </span>
      )}
    </div>
  );
};

export default Avatar;