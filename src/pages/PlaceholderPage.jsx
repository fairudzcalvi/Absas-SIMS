export default function PlaceholderPage({ title }) {
  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.sub}>This section is coming soon.</p>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#8B0000',
  },
  sub: {
    fontSize: '15px',
    color: '#888',
  },
};
