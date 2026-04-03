function Surface({ className = "", children }) {
  return (
    <section className={`premium-card p-5 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export default Surface;
