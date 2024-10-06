function Spinner({ type }) {
  if (type === "mini")
    return (
      <div className="flex justify-center">
        <div className="spinner"></div>
      </div>
    );
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-25 backdrop-blur-sm">
      <div className="spinner"></div>
    </div>
  );
}

export default Spinner;
