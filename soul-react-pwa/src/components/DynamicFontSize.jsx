import { useEffect, useRef, useState } from "react";

const DynamicFontSize = ({
  title,
  imageRef,
  minFont = 16,
  maxFont = 32,
  className,
}) => {
  const titleRef = useRef(null);
  const [fontSize, setFontSize] = useState(maxFont);

  useEffect(() => {
    const imgEl = imageRef?.current;
    if (!imgEl) return;

    // Create an off-screen span to measure text width accurately
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.whiteSpace = "nowrap";
    span.style.fontWeight = "bold";
    span.style.fontFamily = "inherit";
    span.style.fontSize = `${maxFont}px`;
    span.innerText = title;
    document.body.appendChild(span);

    const textWidth = span.offsetWidth;
    document.body.removeChild(span);

    // Total horizontal padding in px
    const padding = 25 * 2; // px-[25px]

    // Compute the available width inside the image
    const imageWidthWithoutPadding = imgEl.clientWidth - 20 - padding; // optional margin

    // Compute scale to fit text + padding inside image
    const scale = Math.min(imageWidthWithoutPadding / textWidth, 1);
    const newFont = Math.max(minFont, Math.min(maxFont, maxFont * scale));

    console.log({ newFont });

    setFontSize(newFont);
  }, [title, imageRef, minFont, maxFont]);

  return (
    <p
      ref={titleRef}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  text-white font-bold px-[25px] py-[10px] rounded-[15px] ${className}`}
      style={{ fontSize }}
    >
      {title}
    </p>
  );
};

export default DynamicFontSize;
