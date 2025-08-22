const Badge = ({ label, classes }) => {
  return (
    <span
      className={`${classes} text-white me-2 px-2 py-0.5 rounded-full`}
      style={{ fontSize: 13 }}
    >
      {label}
    </span>
  );
};

export default Badge;
